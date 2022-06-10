import { BroadcastChannel } from 'broadcast-channel'
import { v4 as uuid } from 'uuid'
import { TinyEmitter } from 'tiny-emitter'
import assign from 'object-assign'
import { assert } from './assert'
import { InvokeError, MessageError, MessageTimeoutError } from './errors'
import {
  ShimoMessageEvent,
  isShimoMessageEventLike,
  MessageEventOptions
} from './message-event'
import debug, { enabled, toggle as toggleDebug } from './debug'
import { structuredClone } from './structured-clone'

export const INVOKE_DEFAUTL_TIMEOUT = 60000

/**
 * 消息到达时的回调函数，在消息正式分发前被调用，也会影响到 `invoke()`。
 * 返回 undefined 时，消息将会被抛弃。
 * 一般用于消息去重。
 */
export type OnMessageArrive = (
  event: ShimoMessageEvent
) => Promise<ShimoMessageEvent | undefined>

export default class ShimoBroadcastChannel {
  readonly id: string

  /**
   * 消息到达时的回调函数，在消息正式分发前被调用，也会影响到 `invoke()`。
   * 返回 undefined 时，消息将会被抛弃。
   * 一般用于消息去重。
   */
  onMessageArrive?: OnMessageArrive

  /**
   * 是否启用自动 structuredClone 在发送前对数据进行处理
   */
  autoStructuredClone: boolean

  private readonly channel: BroadcastChannel

  private readonly emitter: TinyEmitter

  private readonly invokeHandlers: Map<string, InvokeInternalHandler[]> =
  new Map()

  private readonly eventHandlers: Map<
  string,
  Array<[EventHandler<unknown>, BaseContext?]>
  > = new Map()

  private readonly emitterId = uuid()

  constructor (options: Options) {
    this.debug = options.debug === true
    this.autoStructuredClone = options.autoStructuredClone === true

    Object.defineProperty(this, 'id', {
      enumerable: true,
      value:
        typeof options.channelId === 'string'
          ? assert<string>(
            options.channelId.trim(),
            (id: string) => id.length > 0,
            'channelId must be a non-empty string'
          )
          : uuid()
    })

    this.emitter = new TinyEmitter()

    const channel = new BroadcastChannel(this.id)
    channel.addEventListener('message', (evt) => {
      ;(async () => {
        let data: ShimoMessageEvent

        try {
          data = this.initMessageEvent(evt)
        } catch (e) {
          const err = new MessageError(
            e?.message ?? 'message cannot be handled'
          )
          err.originMessage = evt.data
          this.emit('messageError', err)
          return
        }

        await this.distributeMessage(data)
      })().catch(async (err) => {
        this.emit('error', err)
      })
    })

    this.channel = channel
  }

  private initMessageEvent (
    input:
    | {
      data: unknown
      context?: Context
      time?: number
      origin?: string
    }
    | ShimoMessageEvent
  ): ShimoMessageEvent {
    const payload: MessageEventOptions = assign(
      assign({ emitter: this.emitterId }, input, { channelId: this.id })
    )

    if (typeof payload.origin !== 'string') {
      payload.origin = location.origin
    }

    return new ShimoMessageEvent(payload)
  }

  private structuredClone<T>(data: unknown): T {
    return (this.autoStructuredClone ? structuredClone(data) : data) as T
  }

  private addEventListener (
    name: string,
    listener: EventHandler<unknown>,
    context?: BaseContext
  ): void {
    let evts = this.eventHandlers.get(name)
    if (!Array.isArray(evts)) {
      evts = []
    }
    evts.push([listener, context])
    this.eventHandlers.set(name, evts)
  }

  /**
   * 监听事件
   *
   * @param name 事件名称
   * @param listener 监听器
   * @param context 监听的消息的上下文，传了则只会收到相同上下文 audience 的消息
   */
  on<Name extends keyof Events>(
    name: Name,
    listener: EventHandler<Events[Name]>,
    context?: BaseContext
  ): OffEventCallback {
    this.addEventListener(name, listener, context)

    return () => {
      this.off(name, listener, context)
    }
  }

  /**
   * 监听事件，触发一次后自动会 off
   *
   * @param name 事件名称
   * @param listener 监听器
   * @param context 监听的消息的上下文，传了则只会收到相同上下文 audience 的消息
   */
  once<Name extends keyof Events>(
    name: Name,
    listener: EventHandler<Events[Name]>,
    context?: Context
  ): OffEventCallback {
    const cb: OnceHandler = (payload: Events[Name], context?: Context) => {
      this.off(name, listener, context)
      listener(payload, context)
    }
    cb.handler = listener

    this.addEventListener(name, cb, context)

    return () => {
      this.off(name, listener, context)
    }
  }

  /**
   * 取消事件监听
   *
   * @param name 事件名称
   * @param listener 监听器，不传则取消所有监听器
   * @param context 监听的消息的上下文，传了则只取消相同上下文 audience 的监听器
   */
  off<Name extends keyof Events>(
    name: Name,
    listener?: EventHandler<Events[Name]>,
    context?: BaseContext
  ): void {
    if (arguments.length === 1) {
      this.eventHandlers.delete(name)
    } else {
      const evts = this.eventHandlers.get(name)

      if (Array.isArray(evts)) {
        this.eventHandlers.set(
          name,
          evts.filter(([_listener, ctx]) => {
            return (
              (_listener !== listener &&
                (_listener as OnceHandler).handler !== listener) ||
              ctx?.audience === context?.audience
            )
          })
        )
      }
    }
  }

  emit<Name extends keyof Events>(
    name: Name,
    data: Events[Name],
    context?: Context
  ): void {
    debug('emitting event', name, data, context)

    const evts = this.eventHandlers.get(name)
    if (Array.isArray(evts)) {
      for (const [listener, ctx] of evts) {
        if (ctx?.audience === context?.audience) {
          listener(data, context)
        }
      }
    }
  }

  /**
   * 发出一条消息到 channel
   *
   * @param message 消息
   * @param context 消息的上下文，传了则只有相同上下文 audience 的监听器才能收到消息
   */
  async postMessage (message: unknown, context?: BaseContext): Promise<void> {
    debug('pre postMessage', { message, context })

    let data: ShimoMessageEvent

    try {
      if (isShimoMessageEventLike(message)) {
        data = this.initMessageEvent(message as ShimoMessageEvent)
      } else {
        data = this.initMessageEvent({
          data: message,
          context: context != null ? this.mergeContexts([context]) : context
        })
      }

      data = this.structuredClone<ShimoMessageEvent>(data)
    } catch (e) {
      debug('message invalid', e)

      const err = new MessageError(e?.message)
      err.originMessage = message
      throw err
    }

    try {
      await this.channel.postMessage(data)

      this.emit('postMessage', data)

      debug('postMessage success', data)
    } catch (e) {
      debug('post message error', e)

      const err = new MessageError(e?.message)
      err.originMessage = message
      throw err
    }
  }

  /**
   * 在当前 channel 实例里分发消息，不会分发到其它 channel 实例。
   * 一般在 BroadcastChannel 收到消息后，由内部调用，外部调用主要用于类似 cross-origin window 的场景，将收到的消息转入 channel 内部处理。
   *
   * @param messageEvent 消息
   */
  async distributeMessage (messageEvent: ShimoMessageEvent): Promise<void> {
    if (
      messageEvent.context?.channelId !== this.id ||
      messageEvent.emitter === this.emitterId
    ) {
      debug('discarding message', messageEvent)
      return
    }

    // 允许外部实现消息去重逻辑
    if (typeof this.onMessageArrive === 'function') {
      const event = await this.onMessageArrive(messageEvent)
      if (!(event instanceof ShimoMessageEvent)) {
        debug('message arrived but not handled', messageEvent)
        return
      }
      messageEvent = event
    }

    debug('delivering message', messageEvent)

    if (messageEvent.context?.type === ContextType.InvokeRequest) {
      await this.handleInvokeRequest(messageEvent)
      return
    }

    if (messageEvent.context?.type === ContextType.InvokeResponse) {
      this.handleInvokeResponse(messageEvent)
      return
    }

    this.emit('message', messageEvent, messageEvent.context)
  }

  /**
   * 响应其他 channel 发送的 Invoke 调用
   */
  private async handleInvokeRequest (messageEvent: ShimoMessageEvent): Promise<void> {
    debug('handle invoke request', messageEvent)

    const { name, args } = messageEvent.data as InvokeData
    const ctx = messageEvent.context

    const items = this.invokeHandlers.get(name)
    if (!Array.isArray(items)) {
      debug('no invoke handlers', name)
      return
    }

    for (const item of items) {
      if (item.context?.audience !== ctx.audience) {
        continue
      }

      const data: InvokeResponsePayload = { data: undefined }

      try {
        data.data = await item.handler(...args)
      } catch (e) {
        data.error = e
      }

      await this.postMessage(
        data,
        assign({}, ctx, { type: ContextType.InvokeResponse })
      )

      // Invoke 请求只处理第一个匹配的 handler
      return
    }

    debug('no invoke handler found', name)
  }

  /**
   * 处理非当前 channel 响应的 Invoke 结果，会通过 emitter 将 payload 发出去
   */
  private handleInvokeResponse (messageEvent: ShimoMessageEvent): void {
    debug('handle invoke response', messageEvent)

    if (typeof messageEvent.id !== 'string') {
      throw new InvokeError('Invoke response context id is invalid')
    }

    this.emitter.emit(messageEvent.id, messageEvent.data)
  }

  private mergeContexts (contexts: Array<BaseContext | Context>): Context {
    return assign({ channelId: this.id }, ...contexts)
  }

  /**
   * 发出一条 Invoke 消息，并等待返回结果
   * Invoke 消息并不会被监听，只会被发送到 channel 中通过 addInvokeHandler 添加的 handler 中。
   *
   * @parma name 方法名
   * @param args 参数列表
   * @param context 消息上下文
   */
  async invoke<T>(
    name: string,
    args: unknown[],
    context?: BaseContext
  ): Promise<T> {
    const data = {
      name,
      args
    }

    const timeout =
      typeof context?.timeout === 'number' && context?.timeout > 0
        ? context?.timeout
        : INVOKE_DEFAUTL_TIMEOUT
    const ctxId = uuid()

    // 响应 invoke 返回结果
    const p = new Promise<T>((resolve, reject) => {
      // 只处理第一个响应的结果
      this.emitter.once(
        ctxId,
        (data: InvokeResponsePayload) => {
          if (data.error instanceof InvokeError) {
            reject(data.error)
          } else if (data.error != null) {
            // Firefox 暂不支持通过 postMessage 传递 Error 对象
            const err = new InvokeError(
              typeof data.error === 'string' ? data.error : data.error.message
            )
            err.method = name
            err.arguments = args
            reject(err)
          } else {
            resolve(data.data as T)
          }
        }
      )

      setTimeout(() => {
        this.emitter.off(ctxId)
        reject(new MessageTimeoutError(`${name} invoke timeout`))
      }, timeout)
    })

    await this.postMessage(
      data,
      assign({}, context, {
        messageId: ctxId,
        timeout,
        type: ContextType.InvokeRequest
      })
    )

    const result = await p

    if (result instanceof Error) {
      throw result
    }

    return result
  }

  addInvokeHandler (
    name: string,
    handler: InvokeHandler,
    context?: BaseContext
  ): void {
    let items: InvokeInternalHandler[] | undefined =
      this.invokeHandlers.get(name)
    if (!Array.isArray(items)) {
      items = []
    }
    items.push({ handler, context })
    this.invokeHandlers.set(name, items)
  }

  removeInvokeHandler (
    name: string,
    handler: InvokeHandler,
    context?: BaseContext
  ): void {
    const items = this.invokeHandlers.get(name)
    if (Array.isArray(items)) {
      this.invokeHandlers.set(
        name,
        items.filter((item) => {
          return (
            item.handler !== handler ||
            item.context?.audience !== context?.audience
          )
        })
      )
    }
  }

  /**
   * 是否开启 debug 模式。
   *
   * @param enable 是否开启 debug 模式。
   */
  set debug (enable: boolean) {
    toggleDebug(enable)
  }

  get debug (): boolean {
    return enabled()
  }
}

/**
 * 用于发送消息的 poster，在 `channel.postMessage()` 时会调用，用于实现 cross-origin iframe 通信功能。
 */
export type MessagePoster = (message: ShimoMessageEvent) => void

// eslint-disable-next-line @typescript-eslint/consistent-type-definitions
export type Events = {
  /**
   * postMessage 事件，当消息通过 channel 发出后，会触发
   */
  postMessage: ShimoMessageEvent

  /**
   * Channel 收到消息时触发的事件
   */
  message: ShimoMessageEvent

  /**
   * 当 channel 收到无法处理的消息时触发的事件
   */
  messageError: MessageError

  error: MessageError

  invokeResponse: unknown
}

export type EventHandler<T = unknown> = (payload: T, context?: Context) => void

interface OnceHandler {
  (payload: unknown, context?: Context): void
  handler: EventHandler
}

export type OffEventCallback = () => void

export type InvokeHandler = (...args: any[]) => Promise<void>

interface InvokeInternalHandler {
  handler: InvokeHandler
  context?: BaseContext
}

interface InvokeData {
  name: string
  args: unknown[]
}

export interface Options {
  channelId?: string

  debug?: boolean

  /**
   * 是否启用自动 structuredClone 在发送前对数据进行处理
   */
  autoStructuredClone?: boolean
}

/**
 * 消息上下文。
 * 如果在绑定 listener 时指定了 context，
 * 则只有收到的消息的 context.audience 和 listener 的 context.audience 匹配才会将消息传递给 listener。
 */
export interface BaseContext {
  /**
   * 消息的受众，会和 listener 的 context.audience 对比。
   */
  audience?: string

  /**
   * 在 Invoke 过程中，多少 ms 之后，仍未收到结果，就会抛出 MessageTimeoutError。
   */
  timeout?: number

  [key: string]: unknown
}

/**
 * 消息上下文。
 * 如果在绑定 listener 时指定了 context，
 * 则只有收到的消息的 context.audience 和 listener 的 context.audience 匹配才会将消息传递给 listener。
 */
export interface Context extends BaseContext {
  /**
   * 对应的频道 ID。
   */
  channelId: string

  /**
   * 消息的唯一 ID。
   */
  messageId: string

  /**
   * 消息的类型。
   */
  type?: ContextType
}

export enum ContextType {
  InvokeRequest,

  InvokeResponse
}

/**
 * Invoke 调用的响应结果
 */
export interface InvokeResponsePayload {
  /**
   * Invoke 调用的响应结果
   */
  data: unknown

  /**
   * Invoke 调用相应的错误，Firefox 不支持返回 Error，会转换为 string
   */
  error?: Error | string
}

import { BroadcastChannel } from 'broadcast-channel'
import { v4 as uuid } from 'uuid'
import { TinyEmitter } from 'tiny-emitter'
import { assert } from './assert'
import { InvokeError, MessageError, MessageTimeoutError } from './errors'
import {
  ShimoMessageEvent,
  isShimoMessageEventLike,
  MessageEventOptions
} from './message-event'
import { structuredClone } from './structured-clone'
import debug from 'debug'
import isPlainObject from 'is-plain-obj'

export const INVOKE_DEFAUTL_TIMEOUT = 60000

export const DEBUG_NAMESPACE = 'SM_CHAN'

/**
 * 消息到达时的回调函数，在消息正式分发前被调用，也会影响到 `invoke()`。
 * 返回 undefined 时，消息将会被抛弃。
 * 一般用于消息去重。
 */
export type OnMessageArrive = (
  event: ShimoMessageEvent
) => Promise<ShimoMessageEvent | undefined>

export default class ShimoBroadcastChannel {
  /**
   * Channel ID，ID 一致才能通信
   */
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

  private log: debug.Debugger
  private _debugNamespace = DEBUG_NAMESPACE

  constructor (options: Options) {
    this.debug = options.debug === true
    this.debugNamespace = options.debugNamespace ?? DEBUG_NAMESPACE
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
    const payload: MessageEventOptions = Object.assign(
      { emitter: this.emitterId }, input, { channelId: this.id }
    )

    if (typeof payload.origin !== 'string') {
      payload.origin = location.origin
    }

    return new ShimoMessageEvent(payload)
  }

  private structuredClone<T>(data: unknown): T {
    return (this.autoStructuredClone
      ? structuredClone(data, {
        replacer: () => undefined
      })
      : data) as T
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
   * @param name - 事件名称
   * @param listener - 监听器
   * @param context - 监听的消息的上下文，传了则只会收到相同上下文 audience 的消息
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
   * @param name - 事件名称
   * @param listener - 监听器
   * @param context - 监听的消息的上下文，传了则只会收到相同上下文 audience 的消息
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
   * 删除事件监听
   *
   * @param name - 事件名称
   * @param listener - 监听器，不传则删除所有监听器
   * @param context - 监听的消息的上下文，传了则只删除相同上下文 audience 的监听器，audience === '*' 时删除所有监听器
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
        // 删除所有监听器
        if (context?.audience === '*') {
          this.eventHandlers.delete(name)
        } else {
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
  }

  /**
   * 触发事件
   *
   * @param name - 事件名称
   * @param data - 事件数据
   * @param context - 监听的消息的上下文，传了则会对比监听器的 audience，一致或任意一方 audience 为 '*' 时，会触发监听器。
   */
  emit<Name extends keyof Events>(
    name: Name,
    data: Events[Name],
    context?: Context
  ): void {
    const handlers = this.eventHandlers.get(name)

    this.log('emit event', { name, data, context, handlers: handlers })

    if (Array.isArray(handlers)) {
      for (const [listener, listenerCtx] of handlers) {
        if (compareContextAudience(listenerCtx, context)) {
          listener(data, context)
        }
      }
    }
  }

  /**
   * 发出一条消息到 channel
   *
   * @param message - 消息
   * @param context - 消息的上下文，传了则只有相同上下文 audience 的监听器才能收到消息
   */
  async postMessage (message: unknown, context?: BaseContext): Promise<void> {
    let data: ShimoMessageEvent
    let msg: unknown

    try {
      msg = this.structuredClone(message)

      if (isShimoMessageEventLike(msg)) {
        data = this.initMessageEvent(msg as ShimoMessageEvent)
      } else {
        data = this.initMessageEvent({
          data: msg,
          context: context != null ? this.mergeContexts([context]) : context
        })
      }
    } catch (e) {
      this.log('message invalid', message, e)

      const err = new MessageError(e?.message)
      err.originMessage = msg
      throw err
    }

    try {
      this.log('pre postMessage', { message: msg, origin: message, context, structuredCloned: this.autoStructuredClone })

      await this.channel.postMessage(data)

      this.emit('postMessage', data, data.context)

      this.log('postMessage success', data)
    } catch (e) {
      this.log('post message error', e)

      const err = new MessageError(e?.message)
      err.originMessage = message
      throw err
    }
  }

  /**
   * 在当前 channel 实例里分发消息，不会分发到其它 channel 实例。
   * 一般在 BroadcastChannel 收到消息后，由内部调用，外部调用主要用于类似 cross-origin window 的场景，将收到的消息转入 channel 内部处理。
   *
   * @param messageEvent - 消息
   */
  async distributeMessage (messageEvent: ShimoMessageEvent): Promise<void> {
    let evt = messageEvent

    if (
      evt.context?.channelId !== this.id ||
      evt.emitter === this.emitterId
    ) {
      this.log('discard message', evt)
      return
    }

    // 允许外部实现消息去重逻辑
    if (typeof this.onMessageArrive === 'function') {
      const event = await this.onMessageArrive(evt)
      if (!(event instanceof ShimoMessageEvent)) {
        this.log('skip message', evt)
        return
      }
      evt = event
    }

    this.log('distribute message', { message: evt, origin: messageEvent })

    if (evt.context?.type === ContextType.InvokeRequest) {
      await this.handleInvokeRequest(evt)
      return
    }

    if (evt.context?.type === ContextType.InvokeResponse) {
      this.handleInvokeResponse(evt)
      return
    }

    this.emit('message', evt, evt.context)
  }

  /**
   * 响应其他 channel 发送的 Invoke 调用
   */
  private async handleInvokeRequest (messageEvent: ShimoMessageEvent): Promise<void> {
    if (!isPlainObject(messageEvent.data)) {
      this.log('invalid invoke request', messageEvent)
      throw new Error('InvokeRequest data must be an object')
    }

    const { name, args } = (messageEvent.data as unknown) as InvokeData
    const handlers = this.invokeHandlers.get(name)

    this.log('handle invoke request', {
      message: messageEvent,
      handlers
    })

    const ctx = messageEvent.context

    if (!Array.isArray(handlers) || handlers.length === 0) {
      this.log('no invoke handlers', name)
      return
    }

    for (const item of handlers) {
      if (!compareContextAudience(item.context, ctx)) {
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
        Object.assign({}, ctx, { type: ContextType.InvokeResponse })
      )

      // Invoke 请求只处理第一个匹配的 handler
      return
    }

    this.log('no invoke handler found', name)
  }

  /**
   * 处理非当前 channel 响应的 Invoke 结果，会通过 emitter 将 payload 发出去
   */
  private handleInvokeResponse (messageEvent: ShimoMessageEvent): void {
    this.log('handle invoke response', messageEvent)

    if (typeof messageEvent.id !== 'string') {
      throw new InvokeError('Invoke response context id is invalid')
    }

    this.emitter.emit(messageEvent.id, messageEvent.data)
  }

  private mergeContexts (contexts: Array<BaseContext | Context>): Context {
    return Object.assign({ channelId: this.id }, ...contexts)
  }

  /**
   * 发出一条 Invoke 消息，等待并返回接收到的结果。多个频道响应同一个 Invoke 调用时，只会返回第一个收到的结果。
   * Invoke 消息并不会触发 `message` 等事件，只会被发送到 channel 中通过 addInvokeHandler 添加的 handler 中。
   *
   * @param name - 方法名
   * @param args - 参数列表
   * @param context - 消息上下文
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
      Object.assign({}, context, {
        /**
         * 让 message id 维持一致
         */
        messageId: ctxId,
        timeout,
        type: ContextType.InvokeRequest
      })
    )

    try {
      return await p
    } catch (e) {
      this.log('invoke error', { id: ctxId, name, args, payload: data, error: e })
      throw e
    }
  }

  /**
   * 添加 Invoke 处理器。
   *
   * @param name - 方法名
   * @param handler - 处理器
   * @param context - 消息上下文
   */
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

  /**
   * 删除 `name`、`handler` 和 `context.audience` 匹配的 Invoke 处理器。
   *
   * @param name - 方法名
   * @param handler - 处理器
   * @param context - 消息上下文
   */
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
   * @param enable - 是否开启 debug 模式。
   */
  set debug (enable: boolean) {
    debug.enable(enable ? this._debugNamespace : `-${this._debugNamespace}`)
  }

  get debug (): boolean {
    return debug.enabled(this._debugNamespace)
  }

  set debugNamespace (ns: string) {
    const enabled = this.debug
    debug.enable(`-${this._debugNamespace}`)

    this.log = debug(ns)
    this._debugNamespace = ns

    if (enabled) {
      debug.enable(ns)
    }
  }

  get debugNamespace (): string {
    return this._debugNamespace
  }
}

/**
 * 对比 context audience，相等或有一方为 '*' 时返回 true
 */
function compareContextAudience (c1?: BaseContext, c2?: BaseContext): boolean {
  const aud1 = c1?.audience
  const aud2 = c2?.audience
  return aud1 === aud2 || aud1 === '*' || aud2 === '*'
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

export type InvokeHandler = (...args: any[]) => unknown

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

  /**
   * 是否启用 debug 输出
   */
  debug?: boolean

  /**
   * 修改 debug 的命名空间
   */
  debugNamespace?: string

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
   * 消息的受众，会和 listener 的 context.audience 对比。'*' 代表任意 audience，undefined 也是一个合法的 audience。
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
  InvokeRequest = 0,

  InvokeResponse = 1
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

import { uuid } from './uuid'
import { Context } from './shimo-broadcast-channel'
import { assert } from './assert'
import { SOURCE_NAMESPACE } from './constants'

export interface MessageEventOptions {
  data: unknown
  context?: Context
  time?: number
  origin?: string
  emitter: string
  channelId: string
}

export class ShimoMessageEvent {
  /**
   * The data sent by the message emitter.
   */
  readonly data: unknown
  readonly context: Context
  readonly time: number
  /**
   * The ID of the message.
   */
  readonly id: string
  readonly source: string
  readonly origin: string
  readonly emitter: string
  readonly channelId: string

  constructor ({
    data,
    context,
    time,
    origin,
    emitter,
    channelId
  }: MessageEventOptions) {
    const ctx = Object.assign({}, context, { channelId })
    if (typeof ctx.messageId !== 'string' || ctx.messageId.trim() === '') {
      ctx.messageId = uuid()
    }

    Object.defineProperties(this, {
      data: {
        enumerable: true,
        value: data
      },
      context: {
        enumerable: true,
        value: ctx
      },
      time: {
        enumerable: true,
        value: time ?? Date.now()
      },
      id: {
        enumerable: true,
        get () {
          return ctx.messageId
        }
      },
      source: {
        enumerable: true,
        value: SOURCE_NAMESPACE
      },
      origin: {
        enumerable: true,
        value: origin
      },
      emitter: {
        enumerable: true,
        value: emitter
      },
      channelId: {
        enumerable: true,
        get () {
          return ctx.channelId
        }
      }
    })

    assert(
      this.context.channelId,
      (id: unknown) => typeof id === 'string' && id.length > 0,
      'channel id must be a non-empty string'
    )
    assert(
      this.id,
      (id: unknown) => typeof id === 'string' && id.length > 0,
      'id must be a non-empty string'
    )
    assert(
      this.time,
      (time: unknown) => typeof time === 'number' && time >= 0,
      'time must be a positive number'
    )
  }
}

export interface ShimoMessageEventLike extends ShimoMessageEvent {}

export function isShimoMessageEventLike (input: unknown): input is ShimoMessageEventLike {
  if (input instanceof ShimoMessageEvent) {
    return true
  }

  if (typeof input === 'object' && input != null) {
    const obj = input as ShimoMessageEventLike
    return obj.source === SOURCE_NAMESPACE && typeof obj.channelId === 'string' && obj.channelId.length > 0 && obj.context != null
  }

  return false
}

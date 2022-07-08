import { Context } from './shimo-broadcast-channel'

export class MessageError extends Error {
  name = 'MessageError'
  originMessage: unknown
  context: Context

  constructor (message: string) {
    super(message)

    Object.setPrototypeOf(this, MessageTimeoutError.prototype)
  }
}

export class MessageTimeoutError extends Error {
  name = 'MessageTimeoutError'

  constructor (message: string) {
    super(message)

    Object.setPrototypeOf(this, MessageTimeoutError.prototype)
  }
}

export class InvokeError extends Error {
  name = 'InvokeError'
  method: string
  arguments: unknown[]

  constructor (message: string) {
    super(message)

    Object.setPrototypeOf(this, MessageTimeoutError.prototype)
  }
}

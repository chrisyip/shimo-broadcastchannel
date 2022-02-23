import { Context } from './shimo-broadcast-channel'

export class MessageError extends Error {
  originMessage: unknown
  context: Context
}

export class MessageTimeoutError extends Error {

}

export class InvokeError extends Error {
  method: string
  arguments: unknown[]
}

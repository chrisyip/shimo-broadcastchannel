import objectAssign from 'object-assign'
import getGlobal from 'globalthis/polyfill'

import ShimoBroadcastChannel, { Options } from './shimo-broadcast-channel'

export * from './message-event'

export * from './shimo-broadcast-channel'

export * from './errors'

export * from './structured-clone'

export * from './constants'

export { DEBUG_NAMESPACE } from './debug'

export { ShimoBroadcastChannel, Options }

const globalThis = getGlobal() as any

globalThis.shimo = objectAssign({}, globalThis.shimo, {
  createChannel (options: Options) {
    return new ShimoBroadcastChannel(options)
  }
})

declare global {
  interface globalThis {
    shimo: {
      createChannel: (options: Options) => ShimoBroadcastChannel
    }
  }

  interface Window {
    shimo: {
      createChannel: (options: Options) => ShimoBroadcastChannel
    }
  }
}

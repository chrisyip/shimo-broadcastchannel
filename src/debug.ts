import debug from 'debug'

export const DEBUG_NAMESPACE = 'SM_CHANNEL'

export default debug(DEBUG_NAMESPACE)

export function enableDebug (): void {
  debug.enable(DEBUG_NAMESPACE)
}

export function disableDebug (): void {
  debug.disable()
}

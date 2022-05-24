import debug from 'debug'

export const DEBUG_NAMESPACE = 'SM_CHANNEL'

export default debug(DEBUG_NAMESPACE)

export function toggle (enable: boolean): void {
  debug.enable(enable ? DEBUG_NAMESPACE : `-${DEBUG_NAMESPACE}`)
}

export function enabled (): boolean {
  return debug.enabled(DEBUG_NAMESPACE)
}

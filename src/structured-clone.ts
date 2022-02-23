import isPlainObject from 'is-plain-obj'
import assign from 'object-assign'

function isInstanceOf (target: unknown, prototype: any): boolean {
  try {
    return target instanceof prototype
  } catch (e) {
    return false
  }
}

/**
 * Opinionated structuredClone() method. Transferring values are not supported for now.
 *
 * https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API/Structured_clone_algorithm
 */
export function structuredClone (
  /**
   * The object to be cloned.
   */
  value: unknown,

  options: {
    /**
     * The return value of this function will be used to replace the original value.
     */
    replacer?: (value: unknown) => unknown
  } = {}
): unknown {
  if (
    typeof value === 'string' ||
    typeof value === 'number' ||
    typeof value === 'boolean' ||
    typeof value === 'undefined' ||
    value === null ||
    value instanceof Date ||
    value instanceof RegExp ||
    value instanceof Boolean ||
    value instanceof String
  ) {
    return value
  }

  try {
    // 有些浏览器不支持这些对象
    for (const proto of [
      window.ArrayBuffer,
      window.Map,
      window.Set,
      window.DataView,
      window.File,
      window.FileList,
      window.Blob,
      window.ImageBitmap,
      window.ImageData
    ]) {
      if (isInstanceOf(value, proto)) {
        return value
      }
    }
  } catch (e) {}

  if (isPlainObject(value)) {
    const val = value as Record<string, unknown>
    const obj: Record<string, unknown> = {}
    for (const key in val) {
      if (Object.prototype.hasOwnProperty.call(val, key) === true) {
        obj[key] = structuredClone(val[key], options)
      }
    }

    return obj
  }

  if (Array.isArray(value)) {
    return value.map(v => structuredClone(v, options))
  }

  // TypedArray
  try {
    if (value instanceof Object.getPrototypeOf(Uint8Array)) {
      return value
    }
  } catch (e) {}

  if (typeof options.replacer === 'function') {
    // Avoid maximum call stack size exceeded error
    const opts = assign({}, options)
    opts.replacer = undefined

    return structuredClone(options.replacer(value), opts)
  }

  throw new Error(`${String(value)} could not be cloned`)
}

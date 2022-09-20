export const isDef = <T = any>(v?: T): v is T => typeof v !== 'undefined'

// eslint-disable-next-line @typescript-eslint/ban-types
export const isFunction = <T extends Function>(v?: unknown): v is T => typeof v === 'function'

export const isEmpty = (v: unknown): boolean => v === undefined || v === '' || v === null

export const isBoolean = (v: unknown): boolean => typeof v === 'boolean'

export const isArray = (v: unknown): v is any[] => Array.isArray(v)

export const checkType = (v: unknown): string => Object.prototype.toString.call(v).slice(8, -1)

export const isObject = (v: unknown): v is object => typeof v === 'object'

export const hasOwn = <T extends object, K extends keyof T>(val: T, key: K): key is K =>
  Object.prototype.hasOwnProperty.call(val, key)

export const noop = () => {}

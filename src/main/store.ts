import { ModuleTypeGuard, ModuleDefaultLoader, ModuleConstructorOptions } from '.'
require('source-map-support').install()

export interface StoreOptions extends ModuleConstructorOptions {
  prefix: string
}

export interface IlpStore {
  get (key: string): Promise<string | undefined>
  put (key: string, value: string): Promise<void>
  del (key: string): Promise<void>
}

/**
 * A type guard for ILP stores
 *
 * See https://www.typescriptlang.org/docs/handbook/advanced-types.html#user-defined-type-guards
 *
 * @param store a class to test
 */
export const isValidInstance: ModuleTypeGuard<IlpStore> = (store: any): store is IlpStore => {
  return store.get && typeof store.get === 'function' &&
    store.put && typeof store.put === 'function' &&
    store.del && typeof store.del === 'function'
}
export const loadDefaults: ModuleDefaultLoader = () => {
  return [
    'in-memory',
    { prefix: 'ilp:' }
  ]
}

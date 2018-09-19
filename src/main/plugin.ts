import * as crypto from 'crypto'
import { EventEmitter } from 'events'
import { ModuleTypeGuard, ModuleDefaultLoader } from '.'

interface FunctionWithVersion extends Function {
  version?: number
}
export interface PluginConnectOptions {
  timeout?: number
}
export type DataHandler = (data: Buffer) => Promise<Buffer>
export type MoneyHandler = (amount: string) => Promise<void>
export interface IlpPlugin extends EventEmitter {
  constructor: FunctionWithVersion
  connect: (options?: PluginConnectOptions) => Promise<void>
  disconnect: () => Promise<void>
  isConnected: () => boolean
  sendData: DataHandler
  sendMoney: MoneyHandler
  registerDataHandler: (handler: DataHandler) => void
  deregisterDataHandler: () => void
  registerMoneyHandler: (handler: MoneyHandler) => void
  deregisterMoneyHandler: () => void
  getAdminInfo? (): Promise<object>
  sendAdminInfo? (info: object): Promise<object>
}

/**
 * A type guard for ILP plugins
 *
 * See https://www.typescriptlang.org/docs/handbook/advanced-types.html#user-defined-type-guards
 *
 * @param plugin a class to test
 */
export const isValidInstance: ModuleTypeGuard<IlpPlugin> = (plugin: any): plugin is IlpPlugin => {
  return plugin.connect !== undefined &&
    plugin.disconnect !== undefined &&
    plugin.isConnected !== undefined &&
    plugin.sendData !== undefined &&
    plugin.sendMoney !== undefined &&
    plugin.registerDataHandler !== undefined &&
    plugin.deregisterDataHandler !== undefined &&
    plugin.registerMoneyHandler !== undefined &&
    plugin.deregisterMoneyHandler !== undefined
}
export const loadDefaults: ModuleDefaultLoader = () => {
  try {
    require.resolve('ilp-plugin-btp')
    return [
      'ilp-plugin-btp',
      { server: `btp+ws://:${crypto.randomBytes(16).toString('hex')}@localhost:7768` }
    ]
  } catch (e) {
    return [ 'mirror', {} ]
  }
}

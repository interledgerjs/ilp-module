import { DataHandler, MoneyHandler, IlpPlugin, PluginConnectOptions } from '../plugin'
import { IlpLogger } from '../logger'
import { ModuleConstructorOptions, ModuleServices } from '..'
import { EventEmitter } from 'events'
require('source-map-support').install()

export default class MirrorPlugin extends EventEmitter implements IlpPlugin {
  static version = 2
  private _connected = false
  private _dataHandler: DataHandler
  private _moneyHandler: MoneyHandler
  protected _log: IlpLogger
  constructor (options: ModuleConstructorOptions, services: ModuleServices) {
    super()
    this._log = services.log
  }

  public connect (options?: PluginConnectOptions | undefined): Promise<void> {
    this._connected = true
    this._log.debug('Connected')
    return Promise.resolve()
  }
  public disconnect (): Promise<void> {
    this._connected = false
    this._log.debug('Disconnected')
    return Promise.resolve()
  }
  public isConnected (): boolean {
    return this._connected
  }
  public sendData (data: Buffer): Promise<Buffer> {
    this._log.trace(`Mirrored data: ${data.toString('hex')}`)
    return this._dataHandler(data)
  }
  public sendMoney (amount: string): Promise<void> {
    this._log.trace(`Mirrored money: ${amount}`)
    return this._moneyHandler(amount)
  }
  public registerDataHandler (handler: DataHandler) {
    if (this._dataHandler) {
      throw new Error('A data handler is already registered')
    }
    this._log.debug('Registered data handler')
    this._dataHandler = handler
  }
  public deregisterDataHandler () {
    this._log.debug('Deregistered data handler')
    delete(this._dataHandler)
  }
  public registerMoneyHandler (handler: MoneyHandler) {
    if (this._moneyHandler) {
      throw new Error('A money handler is already registered')
    }
    this._log.debug('Registered money handler')
    this._moneyHandler = handler
  }
  public deregisterMoneyHandler () {
    this._log.debug('Deregistered money handler')
    delete(this._moneyHandler)
  }
}

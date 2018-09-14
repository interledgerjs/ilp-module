import { EventEmitter } from 'events'
import { 
  IlpPlugin, DataHandler, MoneyHandler, PluginConnectOptions,
  IlpLogger,
  ModuleConstructorOptions, ModuleServices } from '../../../main';
require('source-map-support').install()

export default class MockPlugin extends EventEmitter implements IlpPlugin {

  static readonly version = 2
  public options: any
  public log: IlpLogger

  constructor (options: ModuleConstructorOptions, services: ModuleServices) {
    super()
    this.options = options
    this.log = services.log
  }
  public connect (options?: PluginConnectOptions | undefined): Promise<void> {
    throw new Error('Not implemented')
  }
  public disconnect (): Promise<void> {
    throw new Error('Not implemented')
  }
  public isConnected (): boolean {
    throw new Error('Not implemented')
  }
  public sendData (data: Buffer): Promise<Buffer> {
    throw new Error('Not implemented')
  }
  public sendMoney (amount: string): Promise<void> {
    throw new Error('Not implemented')
  }
  public registerDataHandler (handler: DataHandler): void {
    throw new Error('Not implemented')
  }
  public deregisterDataHandler (): void {
    throw new Error('Not implemented')
  }
  public registerMoneyHandler (handler: MoneyHandler): void {
    throw new Error('Not implemented')
  }
  public deregisterMoneyHandler (): void {
    throw new Error('Not implemented')
  }

}
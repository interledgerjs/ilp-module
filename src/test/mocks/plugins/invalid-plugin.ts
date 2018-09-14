import { 
  IlpLogger,
  ModuleConstructorOptions, ModuleServices } from '../../../main';
require('source-map-support').install()

// Example of an invalid module
export default class InvalidPlugin {

  public options: any
  public log: IlpLogger

  constructor (options: ModuleConstructorOptions, services: ModuleServices) {
    this.options = options
    this.log = services.log
  }
}
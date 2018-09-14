import { 
  IlpLogger,
  ModuleConstructorOptions, ModuleServices } from '../../../main';
require('source-map-support').install()

// Example of a custom module type
export default class MockWidget {

  public options: any
  public log: IlpLogger

  constructor (options: ModuleConstructorOptions, services: ModuleServices) {
    this.options = options
    this.log = services.log
  }
}
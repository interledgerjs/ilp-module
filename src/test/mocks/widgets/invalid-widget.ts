import { 
  createLogger, IlpLogger,
  ModuleConstructorOptions, ModuleServices } from '../../../main';
require('source-map-support').install()

// Example of an invalid module
class InvalidWidget {

  public options: any
  public log: IlpLogger

  constructor (options: ModuleConstructorOptions, services: ModuleServices) {
    this.options = options
    this.log = services.log
  }
}

export const widget = new InvalidWidget({}, { log: createLogger('invalid-widget')})
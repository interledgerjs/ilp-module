import { IlpLogger, LoggerOptions, LogWriter } from '../logger'
require('source-map-support').install()

export default class ConsoleLogger implements IlpLogger {
  public readonly namespace: string
  public info: LogWriter
  public warn: LogWriter
  public error: LogWriter
  public debug: LogWriter
  public trace: LogWriter
  constructor (options: LoggerOptions) {
    this.namespace = options.namespace
    this.info = console.info.bind(console)
    this.warn = console.warn.bind(console)
    this.error = console.error.bind(console)
    this.debug = console.debug.bind(console)
    this.trace = console.trace.bind(console)
  }
}

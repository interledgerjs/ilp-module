import * as debug from 'debug'
import { IlpLogger, LoggerOptions, LogWriter } from '../logger'
require('source-map-support').install()

export default class DebugLogger implements IlpLogger {
  public readonly namespace: string
  public info: LogWriter
  public warn: LogWriter
  public error: LogWriter
  public debug: LogWriter
  public trace: LogWriter
  constructor (options: LoggerOptions) {
    this.namespace = options.namespace
    this.info = debug(options.namespace + ':info')
    this.warn = debug(options.namespace + ':warn')
    this.error = debug(options.namespace + ':error')
    this.debug = debug(options.namespace + ':debug')
    this.trace = debug(options.namespace + ':trace')
  }
}

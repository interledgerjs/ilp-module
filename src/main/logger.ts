import { ModuleDefaultLoader, ModuleTypeGuard, ModuleConstructorOptions } from '.'
require('source-map-support').install()

export type LogWriter = (formatter: any, ...args: any[]) => void

export interface IlpLogger {
  readonly namespace: string
  info: LogWriter
  warn: LogWriter
  error: LogWriter
  debug: LogWriter
  trace: LogWriter
}

export interface LoggerOptions extends ModuleConstructorOptions {
  namespace: string
}

/**
 * A type guard for ILP stores
 *
 * See https://www.typescriptlang.org/docs/handbook/advanced-types.html#user-defined-type-guards
 *
 * @param store a class to test
 */
export const isValidInstance: ModuleTypeGuard<IlpLogger> = (logger: any): logger is IlpLogger => {
  return logger.info && typeof logger.info === 'function' &&
    logger.warn && typeof logger.warn === 'function' &&
    logger.error && typeof logger.error === 'function' &&
    logger.debug && typeof logger.debug === 'function' &&
    logger.trace && typeof logger.trace === 'function' &&
    logger.namespace && typeof logger.namespace === 'string'
}

export const loadDefaults: ModuleDefaultLoader = () => {
  return [
    'debug',
    {
      namespace: 'ilp'
    }
  ]
}

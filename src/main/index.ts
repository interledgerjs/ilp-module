import * as path from 'path'
require('source-map-support').install()

/**
 * Load known module types
 */

// Logs
import { IlpLogger, LogWriter, LoggerOptions } from './logger'
// tslint:disable-next-line:no-duplicate-imports
import * as logger from './logger'
export {
  IlpLogger, LogWriter, LoggerOptions
}
export const createLogger = (namespace: string) => {
  return createModule('logger', undefined, { namespace }) as IlpLogger
}
export const createCustomLogger = (name: string, options?: ModuleConstructorOptions, services?: ModuleServices) => {
  return createModule('logger', name, options, services) as IlpLogger
}

// Stores
import { IlpStore, StoreOptions } from './store'
// tslint:disable-next-line:no-duplicate-imports
import * as store from './store'
export {
  IlpStore, StoreOptions
}
export const createStore = (name?: string, options?: ModuleConstructorOptions, services?: ModuleServices) => {
  return createModule('store', name, options, services) as IlpStore
}

// Plugins
import { PluginConnectOptions, DataHandler, MoneyHandler, IlpPlugin } from './plugin'
// tslint:disable-next-line:no-duplicate-imports
import * as plugin from './plugin'
export {
  PluginConnectOptions, DataHandler, MoneyHandler, IlpPlugin
}
export const createPlugin = (name?: string, options?: ModuleConstructorOptions, services?: ModuleServices) => {
  return createModule('plugin', name, options, services) as IlpPlugin
}

// Backends
import { AccountInfo, BackendOptions, BackendServices, IlpBackend } from './backend'
// tslint:disable-next-line:no-duplicate-imports
import * as backend from './backend'
import ConsoleLogger from './loggers/console'
export {
  AccountInfo, BackendOptions, BackendServices, IlpBackend
}
export const createBackend = (name?: string, options?: BackendOptions, services?: BackendServices) => {
  return createModule('backend', name, options, services) as IlpBackend
}

const knownModules = {
  logger,
  store,
  plugin,
  backend
}

// This module calls internalLog() to get the log
// In case it's called while creating the log it returns a wrapper around `console`
let log = new ConsoleLogger({ namespace: 'ilp-module' })
log = createLogger('ilp-module')

export interface ModuleConstructorOptions {
  [k: string]: any
}
export interface ModuleServices {
  log: IlpLogger
  store?: IlpStore

  [k: string]: any
}
export type ModuleConstructor = new (options: ModuleConstructorOptions, services?: ModuleServices) => any
export type ModuleTypeGuard<T> = (instance: any) => instance is T
export type ModuleDefaultLoader = () => [ string , ModuleConstructorOptions ]

function moduleExists (path: string) {
  try {
    require.resolve(path)
    return true
  } catch (err) {
    return false
  }
}

export function getModuleRoot (): string {
  return process.env['ILP_MODULE_ROOT'] || process.cwd()
}

export function getModulePrefix (type: string): string {
  return `ilp-${type}-`
}

/**
 * Load the default name and constructor options for a known module type
 * @param type a known module type
 */
function getFromDefaults (type: string): [string | undefined, ModuleConstructorOptions | undefined] {
  if (!knownModules[type] || typeof knownModules[type].loadDefaults !== 'function') {
    log.debug(`No default module for type '${type}'`)
    return [ undefined , undefined ]
  }
  return knownModules[type].loadDefaults()
}

/**
 * Validate an instance of a known module type
 * @param type a known module type
 * @param instance the instance
 */
export function validateInstance (type: string, instance: any) {
  if (!knownModules[type] || typeof knownModules[type].isValidInstance !== 'function') {
    log.warn(`Couldn't validate instance of unknown module type '${type}'`)
    // If we don't have a type guard to use to validate the instance we return true
    // This allows users to define custom module types even though these won't have defaults or validators
    return true
  }

  return knownModules[type].isValidInstance(instance)
}

/**
 * Load the name and constructor options for a module type configured via environment variables
 * @param type a module type (may be a custom type)
 */
export function getFromEnvironment (type: string): [ string | undefined, ModuleConstructorOptions | undefined] {
  const name = `ILP_${type.toUpperCase()}`
  if (process.env[name]) {
    log.debug(`Got ${type} name from env. ${name}=${process.env[name]}`)
  }
  const options = `ILP_${type.toUpperCase()}_OPTIONS`
  if (process.env[options]) {
    log.debug(`Got ${type} options from env variable ${options}`)
  }
  return [ process.env[name], process.env[options] ? JSON.parse(process.env[options] as string) : undefined ]
}

/**
 * Load the name and constructor options for a module type preferring first the values provided (if any),
 * then any configured via environment variables and finally fall back to defaults.
 *
 * @param type a module type (may be a custom type)
 * @param name the name of the module to load
 * @param options the options to pass to the module constructor
 */
export function resolveNameAndOptions (type: string, name?: string, options?: ModuleConstructorOptions): [ string, ModuleConstructorOptions ] {

  const [ defaultName, defaultOptions ] = getFromDefaults(type)
  const [ envName, envOptions ] = getFromEnvironment(type)

  const moduleName = name || envName || defaultName
  if (!moduleName) {
    throw new TypeError(`'${type}' is not a known ILP module type (or no default module found for this type).`)
  }

  return [
    moduleName,
    options || envOptions || defaultOptions || {}
  ]
}

/**
 * Load the constructor a module of the given type preferring first the name provided (if provided),
 * then a name configured via environment variables and finally fall back to the default for the given type.
 *
 * @param type a module type (may be a custom type)
 * @param name the name of the module to load
 */
export function loadModule (type: string | string, name?: string): ModuleConstructor {

  const [searchName] = resolveNameAndOptions(type, name)
  const prefix = getModulePrefix(type)
  const searchPath = path.resolve(getModuleRoot(), `./${type}s/`, searchName)
  const internalSearchPath = path.resolve(__dirname, `./${type}s/`, searchName)
  let moduleName

  if (searchName.startsWith(prefix) && moduleExists(searchName)) {
    log.debug(`Loading module by name. type=${type}, name=${searchName}`)
    moduleName = searchName
  } else if (moduleExists(searchPath)) {
    log.debug(`Loading module from path. type=${type}, path=${searchPath}`)
    moduleName = searchPath
  } else if (moduleExists(internalSearchPath)) {
    log.debug(`Loading built-in module from path. type=${type}, path=${internalSearchPath}`)
    moduleName = internalSearchPath
  } else {
    throw new Error(`${type} not found as a module name or under /${type}s/. name=${searchName}, path=${searchPath}`)
  }

  const loadedModule = require(moduleName)

  if (loadedModule && typeof loadedModule === 'object' && typeof loadedModule.default === 'function') {
    // support ES6 modules
    return loadedModule.default
  } else if (typeof loadedModule === 'function') {
    return loadedModule
  } else {
    throw new TypeError(`${type} does not export a constructor. module=${moduleName}`)
  }
}

/**
 * Create an instance of a module of the given type preferring first the name provided (if provided),
 * then a name configured via environment variables and finally fall back to the default for the given type.
 *
 * For known module types defaults are provided. For custom types a name must be provided, or configured via env variables.
 *
 * The instance will be created by passing both `options` and `services` to the instance constructor.
 *
 * If no `options` are provided options will be loaded from the environment, if available.
 *
 * If no `services` are provided an instance of a 'logger' will be created (using this function) and passed into the module
 * constructor as `services.log`.
 *
 * Known module types will be validated after being instantiated and a `TypeError` will be thrown if the instance is not fo the correct type.
 *
 * @param type a module type (may be a custom type)
 * @param name the name of the module to load
 * @param options the options passed to the constructor of the module
 * @param services the services passed to the constructor of the module
 */
export function createModule (type: string | string, name?: string, options?: ModuleConstructorOptions, services?: ModuleServices): any {

  const [ moduleName, constructorOptions] = resolveNameAndOptions(type, name, options)
  const IlpModule = loadModule(type, moduleName)
  const namespace = moduleName.startsWith(getModulePrefix(type)) ? moduleName : `internal-${type}-${moduleName}`

  // Create Logger service if required
  // TODO - Create other services as required for known types
  const moduleServices = (!services && type !== 'logger') ? { log: createLogger(namespace) } : services

  const instance = new IlpModule(constructorOptions, moduleServices)
  if (validateInstance(type, instance)) {
    return instance
  }
  throw new TypeError(`Loaded a module named ${moduleName} but it is not a valid ${type}.`)
}

import 'mocha'
import * as IlpModule from '../main'
import { isValidInstance } from '../main/logger'
import * as path from 'path'
import * as sinon from 'sinon'
import * as Chai from 'chai'
import * as chaiAsPromised from 'chai-as-promised'
Chai.use(chaiAsPromised)
const assert = Object.assign(Chai.assert, sinon.assert)
require('source-map-support').install()

describe('Known types: logger', function () {
  beforeEach(function () {
    process.env['ILP_MODULE_ROOT'] = path.resolve(__dirname, '../../lib/test/mocks')
    delete(process.env['ILP_LOGGER'])
    delete(process.env['ILP_LOGGER_OPTIONS'])
  })

  describe(`createModule('logger')`, function () {
    it('should return an instance of a logger', function () {
      const logger = IlpModule.createModule('logger')
      assert(typeof(logger.info) === 'function')
      assert(typeof(logger.warn) === 'function')
      assert(typeof(logger.error) === 'function')
      assert(typeof(logger.debug) === 'function')
      assert(typeof(logger.trace) === 'function')
    })

    it('should use DebugLogger if no module name is provided', function () {
      const logger = IlpModule.createModule('logger')
      assert(logger.constructor.name === "DebugLogger")
    })

    it('should throw an error if the provided module is not found', function () {
      assert.throws(() => IlpModule.createModule('logger', 'non-existent-module'))
    })

    it('should load the named module', function () {
      const logger = IlpModule.createModule('logger', 'mock-logger', { namespace: 'TEST'})
      assert(logger.constructor.name === "MockLogger")
    })

    it('should load the logger with the given options', function () {
      const logger = IlpModule.createModule('logger', 'mock-logger', { namespace: 'TEST'})
      assert(logger.namespace === 'TEST')
    })

    it('should load the logger named in env var ILP_LOGGER if available', function () {
      process.env['ILP_LOGGER'] = 'mock-logger'
      const logger = IlpModule.createModule('logger')
      assert(logger.constructor.name === "MockLogger")
    })

    it('should prefer the logger named in parameters over the env var ILP_LOGGER', function () {
      process.env['ILP_LOGGER'] = 'custom-logger'
      const logger = IlpModule.createModule('logger', 'mock-logger', { namespace: 'TEST'})
      assert(logger.constructor.name === "MockLogger")
    })

    it('should load the options in env var ILP_LOGGER_OPTIONS if available', function () {
      process.env['ILP_LOGGER'] = 'mock-logger'
      process.env['ILP_LOGGER_OPTIONS'] = '{"namespace":"TEST"}'
      const logger = IlpModule.createModule('logger')
      assert(logger.constructor.name === "MockLogger")
      assert(logger.namespace === 'TEST')
    })

    it('should prefer the options named in parameters over the env var ILP_LOGGER_OPTIONS', function () {
      process.env['ILP_LOGGER'] = 'custom-logger'
      process.env['ILP_LOGGER_OPTIONS'] = '{"namespace":"FAIL"}'
      const logger = IlpModule.createModule('logger', 'mock-logger', { namespace: 'TEST'})
      assert(logger.namespace === 'TEST')
    })

  })

  describe(`createLogger(namespace)`, function () {
    it('should return an instance of a logger', function () {
      const logger = IlpModule.createLogger('TEST')
      assert(typeof(logger.info) === 'function')
      assert(typeof(logger.warn) === 'function')
      assert(typeof(logger.error) === 'function')
      assert(typeof(logger.debug) === 'function')
      assert(typeof(logger.trace) === 'function')
    })

    it('should use DebugLogger if no module name is provided', function () {
      const logger = IlpModule.createLogger('TEST')
      assert(logger.constructor.name === "DebugLogger")
    })

    it('should load the logger with the given namespace', function () {
      const logger = IlpModule.createLogger('TEST')
      assert(logger.namespace === 'TEST')
    })

    it('should load the logger named in env var ILP_LOGGER if available', function () {
      process.env['ILP_LOGGER'] = 'mock-logger'
      const logger = IlpModule.createLogger('TEST')
      assert(logger.constructor.name === "MockLogger")
    })

  })

  describe(`createCustomLogger(name, options)`, function () {
    it('should return an instance of a logger', function () {
      const logger = IlpModule.createCustomLogger('mock-logger')
      assert(typeof(logger.info) === 'function')
      assert(typeof(logger.warn) === 'function')
      assert(typeof(logger.error) === 'function')
      assert(typeof(logger.debug) === 'function')
      assert(typeof(logger.trace) === 'function')
    })

    it('should throw an error if the provided module is not found', function () {
      assert.throws(() => IlpModule.createCustomLogger('non-existent'))
    })

    it('should load the named logger', function () {
      const logger = IlpModule.createCustomLogger('mock-logger', { namespace: 'TEST'})
      assert(logger.constructor.name === "MockLogger")
    })

    it('should load the logger with the given options', function () {
      const logger = IlpModule.createCustomLogger('mock-logger', { namespace: 'TEST'})
      assert(logger.namespace === 'TEST')
    })

    it('should prefer the logger named in parameters over the env var ILP_LOGGER', function () {
      process.env['ILP_LOGGER'] = 'custom-logger'
      const logger = IlpModule.createCustomLogger('mock-logger', { namespace: 'TEST'})
      assert(logger.constructor.name === "MockLogger")
    })

    it('should load the options in env var ILP_LOGGER_OPTIONS if available', function () {
      process.env['ILP_LOGGER'] = 'mock-logger'
      process.env['ILP_LOGGER_OPTIONS'] = '{"namespace":"TEST"}'
      const logger = IlpModule.createCustomLogger('mock-logger')
      assert(logger.constructor.name === "MockLogger")
      assert(logger.namespace === 'TEST')
    })

    it('should prefer the options named in parameters over the env var ILP_LOGGER_OPTIONS', function () {
      process.env['ILP_LOGGER'] = 'custom-logger'
      process.env['ILP_LOGGER_OPTIONS'] = '{"namespace":"FAIL"}'
      const logger = IlpModule.createCustomLogger('mock-logger', { namespace: 'TEST'})
      assert(logger.namespace === 'TEST')
    })
  })

  describe('Logger isValidInstance()', function () {
    it('should return false for {}', function () {
      assert(!isValidInstance({}))
    })
    it('should return true for createLogger() - default', function () {
      assert(isValidInstance(IlpModule.createLogger('TEST')))
    })
    it('should return true for MockLogger', function () {
      assert(isValidInstance(IlpModule.createCustomLogger('mock-logger')))
    })
  })
})

import 'mocha'
import * as IlpModule from '../main'
import { isValidInstance } from '../main/plugin'
import * as path from 'path'
import * as sinon from 'sinon'
import * as Chai from 'chai'
import * as chaiAsPromised from 'chai-as-promised'
import MockPlugin from './mocks/plugins/mock-plugin';
Chai.use(chaiAsPromised)
const assert = Object.assign(Chai.assert, sinon.assert)
require('source-map-support').install()

describe('Known types: plugin', function () {
  beforeEach(function () {
    process.env['ILP_MODULE_ROOT'] = path.resolve(__dirname, '../../lib/test/mocks')
    delete(process.env['ILP_PLUGIN'])
    delete(process.env['ILP_PLUGIN_OPTIONS'])
  })

  describe(`createModule('plugin')`, function () {
    it('should return an instance of a plugin', function () {
      const plugin = IlpModule.createModule('plugin')
      assert(typeof(plugin.connect) === 'function')
      assert(typeof(plugin.disconnect) === 'function')
      assert(typeof(plugin.isConnected) === 'function')
      assert(typeof(plugin.sendData) === 'function')
      assert(typeof(plugin.sendMoney) === 'function')
      assert(typeof(plugin.registerDataHandler) === 'function')
      assert(typeof(plugin.deregisterDataHandler) === 'function')
      assert(typeof(plugin.registerMoneyHandler) === 'function')
      assert(typeof(plugin.deregisterMoneyHandler) === 'function')
    })

    it('should use ilp-plugin-btp if no module name is provided', function () {
      const plugin = IlpModule.createModule('plugin')
      assert(plugin.constructor.name === "AbstractBtpPlugin")
    })

    it('should throw an error if the provided module is not found', function () {
      assert.throws(() => IlpModule.createModule('plugin', 'non-existent-module'))
    })

    it('should throw an error if the provided module is invalid', function () {
      assert.throws(() => IlpModule.createModule('plugin', 'invalid-plugin'))
    })

    it('should load the named module', function () {
      const plugin = IlpModule.createModule('plugin', 'mock-plugin', { test: true})
      assert(plugin.constructor.name === "MockPlugin")
    })

    it('should load the plugin with the given options', function () {
      const plugin = IlpModule.createModule('plugin', 'mock-plugin', { test: true})
      assert(plugin.options.test)
    })

    it('should load the plugin named in env var ILP_PLUGIN if available', function () {
      process.env['ILP_PLUGIN'] = 'mock-plugin'
      const plugin = IlpModule.createModule('plugin')
      assert(plugin.constructor.name === "MockPlugin")
    })

    it('should prefer the plugin named in parameters over the env var ILP_PLUGIN', function () {
      process.env['ILP_PLUGIN'] = 'ilp-plugin-btp'
      const plugin = IlpModule.createModule('plugin', 'mock-plugin', { test: true})
      assert(plugin.constructor.name === "MockPlugin")
    })

    it('should load the options in env var ILP_PLUGIN_OPTIONS if available', function () {
      process.env['ILP_PLUGIN'] = 'mock-plugin'
      process.env['ILP_PLUGIN_OPTIONS'] = '{"test":"true"}'
      const plugin = IlpModule.createModule('plugin')
      assert(plugin.constructor.name === "MockPlugin")
      assert(plugin.options.test)
    })

    it('should prefer the options named in parameters over the env var ILP_PLUGIN_OPTIONS', function () {
      process.env['ILP_PLUGIN'] = 'ilp-plugin-btp'
      process.env['ILP_PLUGIN_OPTIONS'] = '{"test1":"true"}'
      const plugin = IlpModule.createModule('plugin', 'mock-plugin', { test2: true})
      assert(plugin.options.test1 === undefined)
      assert(plugin.options.test2)
    })

  })

  describe(`createPlugin()`, function () {
    it('should return an instance of a plugin', function () {
      const plugin = IlpModule.createPlugin()
      assert(typeof(plugin.connect) === 'function')
      assert(typeof(plugin.disconnect) === 'function')
      assert(typeof(plugin.isConnected) === 'function')
      assert(typeof(plugin.sendData) === 'function')
      assert(typeof(plugin.sendMoney) === 'function')
      assert(typeof(plugin.registerDataHandler) === 'function')
      assert(typeof(plugin.deregisterDataHandler) === 'function')
      assert(typeof(plugin.registerMoneyHandler) === 'function')
      assert(typeof(plugin.deregisterMoneyHandler) === 'function')
    })

    it('should use ilp-plugin-btp if no module name is provided', function () {
      const plugin = IlpModule.createPlugin()
      assert(plugin.constructor.name === "AbstractBtpPlugin")
    })

    it('should throw an error if the provided module is not found', function () {
      assert.throws(() => IlpModule.createPlugin('non-existent-module'))
    })

    it('should throw an error if the provided module is invalid', function () {
      assert.throws(() => IlpModule.createPlugin('invalid-plugin'))
    })

    it('should load the named module', function () {
      const plugin = IlpModule.createPlugin('mock-plugin', { test: true})
      assert(plugin.constructor.name === "MockPlugin")
    })

    it('should load the plugin with the given options', function () {
      const plugin = IlpModule.createPlugin('mock-plugin', { test: true})
      assert((plugin as MockPlugin).options.test)
    })

    it('should load the plugin named in env var ILP_PLUGIN if available', function () {
      process.env['ILP_PLUGIN'] = 'mock-plugin'
      const plugin = IlpModule.createPlugin()
      assert(plugin.constructor.name === "MockPlugin")
    })

    it('should prefer the plugin named in parameters over the env var ILP_PLUGIN', function () {
      process.env['ILP_PLUGIN'] = 'ilp-plugin-btp'
      const plugin = IlpModule.createPlugin('mock-plugin', { test: true})
      assert(plugin.constructor.name === "MockPlugin")
    })

    it('should load the options in env var ILP_PLUGIN_OPTIONS if available', function () {
      process.env['ILP_PLUGIN'] = 'mock-plugin'
      process.env['ILP_PLUGIN_OPTIONS'] = '{"test":"true"}'
      const plugin = IlpModule.createPlugin()
      assert(plugin.constructor.name === "MockPlugin")
      assert((plugin as MockPlugin).options.test)
    })

    it('should prefer the options named in parameters over the env var ILP_PLUGIN_OPTIONS', function () {
      process.env['ILP_PLUGIN'] = 'ilp-plugin-btp'
      process.env['ILP_PLUGIN_OPTIONS'] = '{"test1":"true"}'
      const plugin = IlpModule.createPlugin('mock-plugin', { test2: true})
      assert((plugin as MockPlugin).options.test1 === undefined)
      assert((plugin as MockPlugin).options.test2)
    })

  })

  describe('Plugin isValidInstance()', function () {
    it('should return false for {}', function () {
      assert(!isValidInstance({}))
    })
    it('should return true for createPlugin() - default', function () {
      assert(isValidInstance(IlpModule.createPlugin()))
    })
    it('should return true for MockPlugin', function () {
      assert(isValidInstance(IlpModule.createPlugin('mock-plugin')))
    })
  })
})

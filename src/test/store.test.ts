import 'mocha'
import * as IlpModule from '../main'
import { isValidInstance } from '../main/store'
import * as path from 'path'
import * as sinon from 'sinon'
import * as Chai from 'chai'
import * as chaiAsPromised from 'chai-as-promised'
import MockStore from './mocks/stores/mock-store';
Chai.use(chaiAsPromised)
const assert = Object.assign(Chai.assert, sinon.assert)
require('source-map-support').install()

describe('Known types: store', function () {
  beforeEach(function () {
    process.env['ILP_MODULE_ROOT'] = path.resolve(__dirname, '../../lib/test/mocks')
    delete(process.env['ILP_STORE'])
    delete(process.env['ILP_STORE_OPTIONS'])
  })

  describe(`createModule('store')`, function () {
    it('should return an instance of a store', function () {
      const store = IlpModule.createModule('store')
      assert(typeof(store.get) === 'function')
      assert(typeof(store.put) === 'function')
      assert(typeof(store.del) === 'function')
    })

    it('should use InMemoryStore if no module name is provided', function () {
      const store = IlpModule.createModule('store')
      assert(store.constructor.name === "InMemoryStore")
    })

    it('should throw an error if the provided module is not found', function () {
      assert.throws(() => IlpModule.createModule('store', 'non-existent-module'))
    })

    it('should load the named module', function () {
      const store = IlpModule.createModule('store', 'mock-store', { prefix: 'TEST'})
      assert(store.constructor.name === "MockStore")
    })

    it('should load the store with the given options', function () {
      const store = IlpModule.createModule('store', 'mock-store', { prefix: 'TEST'})
      assert(store.prefix === 'TEST')
    })

    it('should load the store named in env var ILP_STORE if available', function () {
      process.env['ILP_STORE'] = 'mock-store'
      const store = IlpModule.createModule('store')
      assert(store.constructor.name === "MockStore")
    })

    it('should prefer the store named in parameters over the env var ILP_STORE', function () {
      process.env['ILP_STORE'] = 'custom-store'
      const store = IlpModule.createModule('store', 'mock-store', { prefix: 'TEST'})
      assert(store.constructor.name === "MockStore")
    })

    it('should load the options in env var ILP_STORE_OPTIONS if available', function () {
      process.env['ILP_STORE'] = 'mock-store'
      process.env['ILP_STORE_OPTIONS'] = '{"prefix": "TEST"}'
      const store = IlpModule.createModule('store')
      assert(store.constructor.name === "MockStore")
      assert(store.prefix === 'TEST')
    })

    it('should prefer the options named in parameters over the env var ILP_STORE_OPTIONS', function () {
      process.env['ILP_STORE'] = 'custom-store'
      process.env['ILP_STORE_OPTIONS'] = '{"prefix":"FAIL"}'
      const store = IlpModule.createModule('store', 'mock-store', { prefix: 'TEST'})
      assert(store.prefix === 'TEST')
    })

  })

  describe(`createStore()`, function () {
    it('should return an instance of a store', function () {
      const store = IlpModule.createStore()
      assert(typeof(store.get) === 'function')
      assert(typeof(store.put) === 'function')
      assert(typeof(store.del) === 'function')
    })

    it('should use custom-store if no module name is provided', function () {
      const store = IlpModule.createStore()
      assert(store.constructor.name === "InMemoryStore")
    })

    it('should throw an error if the provided module is not found', function () {
      assert.throws(() => IlpModule.createStore('non-existent-module'))
    })

    it('should load the named module', function () {
      const store = IlpModule.createStore('mock-store', { prefix: 'TEST'})
      assert(store.constructor.name === "MockStore")
    })

    it('should load the store with the given options', function () {
      const store = IlpModule.createStore('mock-store', { prefix: 'TEST'})
      assert((store as MockStore).prefix === 'TEST')
    })

    it('should load the store named in env var ILP_STORE if available', function () {
      process.env['ILP_STORE'] = 'mock-store'
      const store = IlpModule.createStore()
      assert(store.constructor.name === "MockStore")
    })

    it('should prefer the store named in parameters over the env var ILP_STORE', function () {
      process.env['ILP_STORE'] = 'custom-store'
      const store = IlpModule.createStore('mock-store', { prefix: 'TEST'})
      assert(store.constructor.name === "MockStore")
    })

    it('should load the options in env var ILP_STORE_OPTIONS if available', function () {
      process.env['ILP_STORE'] = 'mock-store'
      process.env['ILP_STORE_OPTIONS'] = '{"prefix": "TEST"}'
      const store = IlpModule.createStore()
      assert(store.constructor.name === "MockStore")
      assert((store as MockStore).prefix === 'TEST')
    })

    it('should prefer the options named in parameters over the env var ILP_STORE_OPTIONS', function () {
      process.env['ILP_STORE'] = 'custom-store'
      process.env['ILP_STORE_OPTIONS'] = '{"prefix":"FAIL"}'
      const store = IlpModule.createStore('mock-store', { prefix: 'TEST'})
      assert((store as MockStore).prefix === 'TEST')
    })

  })

  describe('Store isValidInstance()', function () {
    it('should return false for {}', function () {
      assert(!isValidInstance({}))
    })
    it('should return true for createStore() - default', function () {
      assert(isValidInstance(IlpModule.createStore()))
    })
    it('should return true for MockStore', function () {
      assert(isValidInstance(IlpModule.createStore('mock-store')))
    })
  })
})

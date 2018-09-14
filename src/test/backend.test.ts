import 'mocha'
import * as IlpModule from '../main'
import { isValidInstance } from '../main/backend'
import * as path from 'path'
import * as sinon from 'sinon'
import * as Chai from 'chai'
import * as chaiAsPromised from 'chai-as-promised'
import MockBackend from './mocks/backends/mock-backend';
Chai.use(chaiAsPromised)
const assert = Object.assign(Chai.assert, sinon.assert)
require('source-map-support').install()

describe('Known types: backend', function () {
  beforeEach(function () {
    process.env['ILP_MODULE_ROOT'] = path.resolve(__dirname, '../../lib/test/mocks')
    delete(process.env['ILP_BACKEND'])
    delete(process.env['ILP_BACKEND_OPTIONS'])
  })

  describe(`createModule('backend')`, function () {
    it('should return an instance of a backend', function () {
      const backend = IlpModule.createModule('backend')
      assert(typeof(backend.connect) === 'function')
      assert(typeof(backend.getRate) === 'function')
      assert(typeof(backend.submitPayment) === 'function')
    })

    it('should use OneToOneBackend if no module name is provided', function () {
      const backend = IlpModule.createModule('backend')
      assert(backend.constructor.name === "OneToOneBackend")
    })

    it('should throw an error if the provided module is not found', function () {
      assert.throws(() => IlpModule.createModule('backend', 'non-existent-module'))
    })

    it('should load the named module', function () {
      const backend = IlpModule.createModule('backend', 'mock-backend')
      assert(backend.constructor.name === "MockBackend")
    })

    it('should load the backend with the given options', function () {
      const backend = IlpModule.createModule('backend', 'mock-backend', { spread: 1})
      assert(backend.spread === 1)
    })

    it('should load the backend named in env var ILP_BACKEND if available', function () {
      process.env['ILP_BACKEND'] = 'mock-backend'
      const backend = IlpModule.createModule('backend')
      assert(backend.constructor.name === "MockBackend")
    })

    it('should prefer the backend named in parameters over the env var ILP_BACKEND', function () {
      process.env['ILP_BACKEND'] = 'custom-backend'
      const backend = IlpModule.createModule('backend', 'mock-backend')
      assert(backend.constructor.name === "MockBackend")
    })

    it('should load the options in env var ILP_BACKEND_OPTIONS if available', function () {
      process.env['ILP_BACKEND'] = 'mock-backend'
      process.env['ILP_BACKEND_OPTIONS'] = '{"spread":1}'
      const backend = IlpModule.createModule('backend')
      assert(backend.constructor.name === "MockBackend")
      assert(backend.spread === 1)
    })

    it('should prefer the options named in parameters over the env var ILP_BACKEND_OPTIONS', function () {
      process.env['ILP_BACKEND'] = 'custom-backend'
      process.env['ILP_BACKEND_OPTIONS'] = '{"spread":-1}'
      const backend = IlpModule.createModule('backend', 'mock-backend', { spread: 1})
      assert(backend.spread === 1)
    })

  })

  describe(`createBackend()`, function () {
    it('should return an instance of a backend', function () {
      const backend = IlpModule.createBackend()
      assert(typeof(backend.connect) === 'function')
      assert(typeof(backend.getRate) === 'function')
      assert(typeof(backend.submitPayment) === 'function')
    })

    it('should use OneToOneBackend if no module name is provided', function () {
      const backend = IlpModule.createBackend()
      assert(backend.constructor.name === "OneToOneBackend")
    })

    it('should throw an error if the provided module is not found', function () {
      assert.throws(() => IlpModule.createBackend('non-existent-module'))
    })

    it('should load the named module', function () {
      const backend = IlpModule.createBackend('mock-backend', { spread: 1 })
      assert(backend.constructor.name === "MockBackend")
    })

    it('should load the backend with the given options', function () {
      const backend = IlpModule.createBackend('mock-backend', { spread: 1 })
      assert((backend as MockBackend).spread === 1)
    })

    it('should load the backend named in env var ILP_BACKEND if available', function () {
      process.env['ILP_BACKEND'] = 'mock-backend'
      const backend = IlpModule.createBackend()
      assert(backend.constructor.name === "MockBackend")
    })

    it('should prefer the backend named in parameters over the env var ILP_BACKEND', function () {
      process.env['ILP_BACKEND'] = 'custom-backend'
      const backend = IlpModule.createBackend('mock-backend', { spread: 1})
      assert(backend.constructor.name === "MockBackend")
    })

    it('should load the options in env var ILP_BACKEND_OPTIONS if available', function () {
      process.env['ILP_BACKEND'] = 'mock-backend'
      process.env['ILP_BACKEND_OPTIONS'] = '{"spread":1}'
      const backend = IlpModule.createBackend()
      assert(backend.constructor.name === "MockBackend")
      assert((backend as MockBackend).spread === 1)
    })

    it('should prefer the options named in parameters over the env var ILP_BACKEND_OPTIONS', function () {
      process.env['ILP_BACKEND'] = 'custom-backend'
      process.env['ILP_BACKEND_OPTIONS'] = '{"spread":-1}'
      const backend = IlpModule.createBackend('mock-backend', { spread: 1})
      assert((backend as MockBackend).spread === 1)
    })

  })

  describe('Backend isValidInstance()', function () {
    it('should return false for {}', function () {
      assert(!isValidInstance({}))
    })
    it('should return true for createBackend() - default', function () {
      assert(isValidInstance(IlpModule.createBackend()))
    })
    it('should return true for MockBackend', function () {
      assert(isValidInstance(IlpModule.createBackend('mock-backend')))
    })
  })
})

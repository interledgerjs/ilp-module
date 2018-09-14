import 'mocha'
import * as IlpModule from '../main'
import * as path from 'path'
import * as sinon from 'sinon'
import * as Chai from 'chai'
import * as chaiAsPromised from 'chai-as-promised'
Chai.use(chaiAsPromised)
const assert = Object.assign(Chai.assert, sinon.assert)
require('source-map-support').install()

describe('ilp-module core functions', function () {
  beforeEach(function () {
    process.env['ILP_MODULE_ROOT'] = path.resolve(__dirname, '../../lib/test/mocks')
    delete(process.env['ILP_PLUGIN'])
    delete(process.env['ILP_PLUGIN_OPTIONS'])
    delete(process.env['ILP_CUSTOM'])
    delete(process.env['ILP_CUSTOM_OPTIONS'])
  })

  describe(`resolveNameAndOptions`, function () {

    it('should return "ilp-plugin-btp" if no module name is provided', function () {
      const [name, options] = IlpModule.resolveNameAndOptions('plugin')
      assert(name === 'ilp-plugin-btp')
      assert(options.server.startsWith('btp+ws'))
    })

    it('should load the named module', function () {
      const [name] = IlpModule.resolveNameAndOptions('plugin', 'non-existent-module')
      assert(name === "non-existent-module")
    })


    it('should throw an error if the provided module type is not known and no name provided', function () {
      assert.throws(() => IlpModule.resolveNameAndOptions('custom'))
    })

    it('should load the module named in env var ILP_<TYPE> if available', function () {
      process.env['ILP_CUSTOM'] = 'custom-module'
      const [name] = IlpModule.resolveNameAndOptions('custom')
      assert(name === "custom-module")
    })

    it('should prefer the module named in parameters over the env var', function () {
      process.env['ILP_CUSTOM'] = 'custom-module'
      const [name] = IlpModule.resolveNameAndOptions('custom', 'my-module')
      assert(name === "my-module")
    })

    it('should load the options in env var ILP_<TYPE>_OPTIONS if available', function () {
      process.env['ILP_CUSTOM'] = 'custom-module'
      process.env['ILP_CUSTOM_OPTIONS'] = '{"customOption":true}'
      const [name, options] = IlpModule.resolveNameAndOptions('custom')
      assert(name === "custom-module")
      assert(options.customOption)
    })

    it('should prefer the options named in parameters over the env var', function () {
      process.env['ILP_CUSTOM'] = 'custom-module'
      process.env['ILP_CUSTOM_OPTIONS'] = '{"customOption":true}'
      const [name, options] = IlpModule.resolveNameAndOptions('custom', undefined, { customOption2: true })
      assert(name === "custom-module")
      assert(options.customOption === undefined)
      assert(options.customOption2)
    })
  })
})
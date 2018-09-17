import 'mocha'
import * as sinon from 'sinon'
import * as Chai from 'chai'
import * as chaiAsPromised from 'chai-as-promised'
import { createPlugin } from '../../main'
Chai.use(chaiAsPromised)
const assert = Object.assign(Chai.assert, sinon.assert)
require('source-map-support').install()

describe('Built-in modules: MirrorPlugin', function () {
  beforeEach(function () {
  })

  it('should mirror the provided data', async function () {
    const plugin = createPlugin('mirror')
    const request = Buffer.from('Hello', 'utf8')
    const expectedResponse = Buffer.from('World', 'utf8')

    plugin.registerDataHandler(async (data: Buffer) => {
      assert.equal(data, request)
      return expectedResponse
    })
    const actualResponse = plugin.sendData(request)
    await assert.eventually.equal(actualResponse, expectedResponse)
  })
  
  it('should mirror the provided amount', async function () {
    const plugin = createPlugin('mirror')
    const request = "10"

    plugin.registerMoneyHandler(async (amount: string) => {
      assert.equal(amount, request)
    })
    await plugin.sendMoney(request)
  })

  it('should throw if no data handler registered', async function () {
    const plugin = createPlugin('mirror')
    assert.throws(plugin.sendData.bind(plugin, Buffer.alloc(0)))
  })

  it('should throw if no money handler registered', async function () {
    const plugin = createPlugin('mirror')
    assert.throws(plugin.sendMoney.bind(plugin, "10"))
  })
})

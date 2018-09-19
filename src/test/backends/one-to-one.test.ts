import 'mocha'
import * as path from 'path'
import * as sinon from 'sinon'
import * as Chai from 'chai'
import * as chaiAsPromised from 'chai-as-promised'
import { createBackend, AccountInfo, createLogger } from '../../main'
Chai.use(chaiAsPromised)
const assert = Object.assign(Chai.assert, sinon.assert)
require('source-map-support').install()

describe('Built-in modules: OneToOneBackend', function () {
  beforeEach(function () {
  })

  it('should return a 1:1 rate', function () {
    const backend = createBackend('one-to-one', {
      spread: 0
    }, {
      log: createLogger('one-to-one-backend'),
      getInfo: (accountId: string): AccountInfo => {
        return {
          assetCode: 'USD',
          assetScale: 2,
          relation: 'peer'
        }
      }
    })
    assert.eventually.equal(backend.getRate('alice','bob'), 1)
  })
  
  it('should return a scaled 1:1 rate', async function () {
    const backend = createBackend('one-to-one', {
      spread: 0
    }, {
      log: createLogger('one-to-one-backend'),
      getInfo: (accountId: string): AccountInfo => {
        return {
          assetCode: 'USD',
          assetScale: accountId === 'alice' ? 2 : 4,
          relation: 'peer'
        }
      }
    })
    assert.eventually.equal(backend.getRate('alice','bob'), 100)
  })

  it('should throw with bad source account data', async function () {
    const backend = createBackend('one-to-one', {
      spread: 0
    }, {
      log: createLogger('one-to-one-backend'),
      getInfo: (accountId: string): AccountInfo | undefined => {
        return (accountId === 'bob') ? {
          assetCode: 'USD',
          assetScale:  2,
          relation: 'peer'
        } : undefined
      }
    })
    await Chai.expect(backend.getRate('alice','bob')).to.be.rejected
  })

  it('should throw with no getInfo() service if given account data', async function () {
    const backend = createBackend('one-to-one')
    await Chai.expect(backend.getRate('alice','bob')).to.be.rejected
  })

  it('should throw if given source and destination codes differ', async function () {
    const backend = createBackend('one-to-one')
    await Chai.expect(backend.getRate({code: 'USD', scale: 2},{code: 'EUR', scale: 2})).to.be.rejected
  })

  it('should return a 1:1 rate (no getInfo() service)', async function () {
    const backend = createBackend('one-to-one')
    assert.eventually.equal(backend.getRate({code: 'USD', scale: 2},{code: 'USD', scale: 2}), 1)
  })

  it('should throw with bad destination account data', async function () {
    const backend = createBackend('one-to-one', {
      spread: 0
    }, {
      log: createLogger('one-to-one-backend'),
      getInfo: (accountId: string): AccountInfo | undefined => {
        return (accountId === 'alice') ? {
          assetCode: 'USD',
          assetScale:  2,
          relation: 'peer'
        } : undefined
      }
    })
    await Chai.expect(backend.getRate('alice','bob')).to.be.rejected
  })
  
  it('should noop for connect() and submitPayment()', async function () {
    const backend = createBackend('one-to-one', {
      spread: 0
    }, {
      log: createLogger('one-to-one-backend'),
      getInfo: (accountId: string): AccountInfo => {
        return {
          assetCode: 'USD',
          assetScale: 2,
          relation: 'peer'
        }
      }
    })
    await backend.connect()
    await backend.submitPayment({
      destinationAccount: 'alice',
      destinationAmount: '100',
      sourceAccount: 'bob',
      sourceAmount: '100'
    })
  })

})

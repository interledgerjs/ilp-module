import 'mocha'
import * as path from 'path'
import * as sinon from 'sinon'
import * as Chai from 'chai'
import * as chaiAsPromised from 'chai-as-promised'
import { createStore } from '../../main'
Chai.use(chaiAsPromised)
const assert = Object.assign(Chai.assert, sinon.assert)
require('source-map-support').install()

describe('Built-in modules: InMemoryStore', function () {
  beforeEach(function () {
  })

  it('should return the stored value', function () {
    const store = createStore('in-memory')
    const value = store.put('KEY', 'VALUE').then(() => {
      return store.get('KEY')
    })
    assert.eventually.equal(value, 'VALUE')
  })
  
  it('should delete the stored value', function () {
    const store = createStore('in-memory')
    const value = store.put('KEY', 'VALUE').then(() => {
      return store.del('KEY').then(() => {
        return store.get('KEY')
      })
    })
    assert.eventually.equal(value, undefined)
  })

  it('should return undefined for a unknown key', function () {
    const store = createStore('in-memory')
    assert.eventually.equal(store.get('KEY'), undefined)
  })
  
})

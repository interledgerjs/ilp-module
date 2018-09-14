import { IlpStore } from '../store'
require('source-map-support').install()

export default class InMemoryStore implements IlpStore {
  protected _store: Map<string, string>
  constructor () {
    this._store = new Map()
  }
  async get (k: string) {
    return this._store.get(k)
  }
  async put (k: string, v: string) {
    this._store.set(k, v)
  }

  async del (k: string) {
    this._store.delete(k)
  }
}

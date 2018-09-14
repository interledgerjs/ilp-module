import { IlpStore, StoreOptions } from "../../../main/store";
import { ModuleServices } from "../../../main";
require('source-map-support').install()

export default class MockStore implements IlpStore{

    public prefix: string

    constructor(options: StoreOptions, services: ModuleServices) {
        this.prefix = options.prefix
    }

    get (key: string): Promise<string | undefined> {
        throw new Error('not implemented')
    }
    put (key: string, value: string): Promise<void> {
        throw new Error('not implemented')
    }
    del (key: string): Promise<void> {
        throw new Error('not implemented')
    }
}
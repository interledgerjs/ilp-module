import { IlpLogger, LogWriter, LoggerOptions } from "../../../main/logger";
require('source-map-support').install()

export default class MockLogger implements IlpLogger{
    public namespace: string

    constructor(options: LoggerOptions) {
        this.namespace = options.namespace
    }

    info (formatter: any, ...args: any[]): void {
        throw new Error('not implemented')
    }
    warn (formatter: any, ...args: any[]): void {
        throw new Error('not implemented')
    }
    error (formatter: any, ...args: any[]): void {
        throw new Error('not implemented')
    }
    debug (formatter: any, ...args: any[]): void {
        throw new Error('not implemented')
    }
    trace (formatter: any, ...args: any[]): void {
        throw new Error('not implemented')
    }
}
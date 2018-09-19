import { AccountInfo, IlpBackend, BackendOptions, BackendServices, SubmitPaymentParams } from "../../../main/backend";
import { IlpLogger } from "../../../main/logger";
require('source-map-support').install()

export default class MockBackend implements IlpBackend {

    public spread: number
    public getInfo?: (accountId: string) => AccountInfo | undefined
    public log: IlpLogger

    constructor(options: BackendOptions, services: BackendServices) {
        this.spread = options.spread
        this.getInfo = services.getInfo 
        this.log = services.log
    }
    connect(): Promise<void> {
        throw new Error("Method not implemented.");
    }
    getRate(sourceAccount: string, destinationAccount: string): Promise<number> {
        throw new Error("Method not implemented.");
    }
    submitPayment(params: SubmitPaymentParams): Promise<void> {
        throw new Error("Method not implemented.");
    }
}
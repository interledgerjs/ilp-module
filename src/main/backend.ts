import { ModuleConstructorOptions, ModuleServices, ModuleDefaultLoader, ModuleTypeGuard } from '.'
require('source-map-support').install()

export interface AccountInfo {
  relation: 'parent' | 'peer' | 'child',
  assetCode: string,
  assetScale: number,
}

export interface SubmitPaymentParams {
  sourceAccount: string
  destinationAccount: string
  sourceAmount: string
  destinationAmount: string
}

/** API exposed by the connector to its backends */
export interface BackendServices extends ModuleServices {
  getInfo: (accountId: string) => AccountInfo | undefined
}

export interface IlpBackend {
  connect (): Promise<void>
  getRate (sourceAccount: string, destinationAccount: string): Promise<number>
  submitPayment (params: SubmitPaymentParams): Promise<void>
}

export interface BackendOptions extends ModuleConstructorOptions {
  spread: number
}

export const isValidInstance: ModuleTypeGuard<IlpBackend> = (backend: any): backend is IlpBackend => {
  return backend.connect && typeof backend.connect === 'function' &&
    backend.getRate && typeof backend.getRate === 'function' &&
    backend.submitPayment && typeof backend.submitPayment === 'function'
}

export const loadDefaults: ModuleDefaultLoader = () => {
  return [
    'one-to-one',
    {
      spread: 0
    }
  ]
}

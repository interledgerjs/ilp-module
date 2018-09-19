import { ModuleConstructorOptions, ModuleServices, ModuleDefaultLoader, ModuleTypeGuard } from '.'

export interface AccountInfo {
  relation: 'parent' | 'peer' | 'child',
  assetCode: string,
  assetScale: number,
}

/**
 * An asset/currency including the code used to identify it (e.g. ISO4017 currency code) and scale
 */
export interface AssetInfo {
  scale: number
  code: string
}

export interface SubmitPaymentParams {
  sourceAccount: string
  destinationAccount: string
  sourceAmount: string
  destinationAmount: string
}

/** API exposed by the connector to its backends */
export interface BackendServices extends ModuleServices {
  getInfo?: (accountId: string) => AccountInfo | undefined
}

export interface IlpBackend {
  connect (): Promise<void>
  getRate (sourceAccount: string | AssetInfo, destinationAccount: string | AssetInfo): Promise<number>
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

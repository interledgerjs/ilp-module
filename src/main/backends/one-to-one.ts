import BigNumber from 'bignumber.js'
import { IlpLogger } from '../logger'
import { AccountInfo, BackendOptions, IlpBackend, BackendServices, AssetInfo } from '../backend'

/**
 * Backend which trades everything one-to-one (plus a spread).
 */
export default class OneToOneBackend implements IlpBackend {
  protected spread: number
  protected getInfo?: (accountId: string) => AccountInfo | undefined
  protected log: IlpLogger

  /**
   * Constructor.
   *
   * @param {Integer} opts.spread The spread we will use to mark up the FX rates
   */
  constructor (options: BackendOptions, services: BackendServices) {
    this.spread = options.spread || 0
    this.log = services.log
    this.getInfo = services.getInfo
  }

  /**
   * Nothing to do since this backend is totally static.
   */
  async connect () {
    // Nothing to do
  }

  /**
   * Get a rate for the given parameters.
   *
   * The one-to-one backend applies an exchange of 1, however, it will subtract
   * the spread if a spread is set in the configuration.
   *
   * @param sourceAccount The account ID of the previous party
   * @param destinationAccount The account ID of the next hop party
   */
  async getRate (sourceAccount: string | AssetInfo, destinationAccount: string | AssetInfo) {

    let sourceScale
    if (typeof(sourceAccount) === 'string') {
      if (this.getInfo) {
        const sourceInfo = this.getInfo(sourceAccount)
        if (!sourceInfo) {
          throw new Error(`Unable to fetch account info for source account. accountId=${sourceAccount}`)
        }
        sourceScale = sourceInfo.assetScale
      } else {
        throw new Error(`Unable to fetch account info. Required service 'getInfo()' is not defined.`)
      }
    } else {
      sourceScale = sourceAccount.scale
    }

    let destinationScale
    if (typeof(destinationAccount) === 'string') {
      if (this.getInfo) {
        const destinationInfo = this.getInfo(destinationAccount)
        if (!destinationInfo) {
          throw new Error(`Unable to fetch account info for destination account. accountId=${sourceAccount}`)
        }
        destinationScale = destinationInfo.assetScale
      } else {
        throw new Error(`Unable to fetch account info. Required service 'getInfo()' is not defined.`)
      }
    } else {
      destinationScale = destinationAccount.scale
    }

    const scaleDiff = destinationScale - sourceScale
    // The spread is subtracted from the rate when going in either direction,
    // so that the DestinationAmount always ends up being slightly less than
    // the (equivalent) SourceAmount -- regardless of which of the 2 is fixed:
    //
    //   SourceAmount * (1 - Spread) = DestinationAmount
    //
    const rate = new BigNumber(1).minus(this.spread).shiftedBy(scaleDiff).toPrecision(15)

    return Number(rate)
  }

  /**
   * This method is called to allow statistics to be collected by the backend.
   *
   * The one-to-one backend does not support this functionality.
   */
  submitPayment () {
    return Promise.resolve()
  }
}

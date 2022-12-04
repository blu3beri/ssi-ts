import type { KeyExchange } from './types'
import type { KeyDerivation } from './types/KeyDerivation'

import { DIDCommError } from '../error'

export class EcdhEs<Key extends KeyExchange> implements KeyDerivation {
  private ephemeralKey: Key
  private recipientKey: Key
  private alg: Uint8Array
  private apu: Uint8Array
  private apv: Uint8Array
  private receive: boolean

  public constructor(options: {
    ephemeralKey: Key
    recipientKey: Key
    alg: Uint8Array
    apu: Uint8Array
    apv: Uint8Array
    receive: boolean
  }) {
    this.alg = options.alg
    this.apu = options.apu
    this.apv = options.apv
    this.receive = options.receive
    this.ephemeralKey = options.ephemeralKey
    this.recipientKey = options.recipientKey
  }

  public deriveKeyBytes(keyOutput: Uint8Array): void {
    if (keyOutput.length > 32) throw new DIDCommError('Exceeded maximum output length')
    throw new Error('Method not implemented.')
  }
}

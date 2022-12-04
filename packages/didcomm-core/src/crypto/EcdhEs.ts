import type { JoseKdf } from './JoseKdf'
import type { KeyExchange } from './types'
import type { FromKeyDerivation } from './types/FromKeyDerivation'
import type { KeyDerivation } from './types/KeyDerivation'
import type { KeyWrap } from './types/KeyWrap'

export class EcdhEs<Key extends KeyExchange> implements JoseKdf, KeyDerivation {
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

  public static deriveKey<Key extends KeyExchange, KW extends KeyWrap & FromKeyDerivation>(
    options: {
      ephemeralKey: Key
      senderKey?: Key
      recipientKey: Key
      alg: Uint8Array
      apu: Uint8Array
      apv: Uint8Array
      ccTag: Uint8Array
      receive: boolean
    },
    fkw: typeof FromKeyDerivation
  ): KW {
    const derivation = new EcdhEs(options)
    const kw = fkw.fromKeyDerivation(derivation)
    return kw as KW
  }

  public deriveKeyBytes(keyOutput: Uint8Array): void {
    throw new Error('Method not implemented.')
  }
}

import type { JweAlgorithm } from '../jwe/envelope'
import type { FromKeyDerivation, JoseKdf, KeyDerivation, KeyExchange, KeyWrap } from './JoseKdf'

import { DIDCommError } from '../error'

export class EcdhEs<Key extends KeyExchange, Kw extends KeyWrap & FromKeyDerivation>
  implements KeyDerivation, JoseKdf<Key, Kw>
{
  private ephemeralKey: Key
  private recipientKey: Key
  private alg: JweAlgorithm
  private apu: Uint8Array
  private apv: Uint8Array
  private receive: boolean

  public constructor(options: {
    ephemeralKey: Key
    recipientKey: Key
    alg: JweAlgorithm
    apu: Uint8Array
    apv: Uint8Array
    receive: boolean
  }) {
    this.ephemeralKey = options.ephemeralKey
    this.recipientKey = options.recipientKey
    this.alg = options.alg
    this.apu = options.apu
    this.apv = options.apv
    this.receive = options.receive
  }

  // TODO
  public deriveKeyBytes(): Uint8Array {
    return new Uint8Array([0])
  }

  public deriveKey(
    options: {
      ephemeralKey: Key
      senderKey?: Key
      recipientKey: Key
      alg: JweAlgorithm
      apu: Uint8Array
      apv: Uint8Array
      ccTag: Uint8Array
      receive: boolean
    },
    extra: { kw: Kw }
  ): Kw {
    const derivation = new EcdhEs(options)
    // TODO: why is this incorrect
    const kd = extra.kw.fromKeyDerivation(derivation)
    if (!kd) throw new DIDCommError('Unable to derive kw')

    return kd as Kw
  }
}

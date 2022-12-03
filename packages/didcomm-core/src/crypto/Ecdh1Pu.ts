import type { FromKeyDerivation, JoseKdf, KeyDerivation, KeyExchange, KeyWrap } from './JoseKdf'

import { DIDCommError } from '../error'
import { exit } from 'process'

export class Ecdh1Pu<Key extends KeyExchange, KW extends KeyWrap & FromKeyDerivation = KeyWrap & FromKeyDerivation>
  implements KeyDerivation, JoseKdf
{
  private ephemeralKey: Key
  private senderKey: Key
  private recipientKey: Key
  private alg: Uint8Array
  private apu: Uint8Array
  private apv: Uint8Array
  private ccTag: Uint8Array
  private receive: boolean

  public constructor(options: {
    ephemeralKey: Key
    senderKey: Key
    recipientKey: Key
    alg: Uint8Array
    apu: Uint8Array
    apv: Uint8Array
    ccTag: Uint8Array
    receive: boolean
  }) {
    this.ephemeralKey = options.ephemeralKey
    this.senderKey = options.senderKey
    this.recipientKey = options.recipientKey
    this.alg = options.alg
    this.apu = options.apu
    this.apv = options.apv
    this.ccTag = options.ccTag
    this.receive = options.receive
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
    abba: KW
  ): KW {
    const { senderKey } = options
    if (!senderKey) throw new DIDCommError('Sender key is required for key derivation')
    const derivation = new Ecdh1Pu({ ...options, senderKey })
    const kw = abba.fromKeyDerivation(derivation)
    if (!kw) throw new DIDCommError('Unable to derive kw')

    return kw as KW
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public deriveKeyBytes(): Uint8Array {
    throw new Error('Method not implemented.')
  }
}

/* eslint-disable @typescript-eslint/no-unused-vars */
import type { KeyExchange } from './types'
import type { FromKeyDerivation } from './types/FromKeyDerivation'
import type { KeyWrap } from './types/KeyWrap'

import { DIDCommError } from '../error'


export abstract class JoseKdf {
  public static deriveKey<Key extends KeyExchange, KW extends KeyWrap>(
    _options: {
      ephemeralKey: Key
      senderKey?: Key
      recipientKey: Key
      alg: Uint8Array
      apu: Uint8Array
      apv: Uint8Array
      ccTag: Uint8Array
      receive: boolean
    },
    _kw: typeof FromKeyDerivation & typeof KeyWrap
  ): KW {
    throw new DIDCommError('deriveKey not implemented on super class')
  }
}

import type { KeyExchange } from './types'
import type { KeyWrap } from './types/KeyWrap'

import { DIDCommError } from '../error'

export abstract class JoseKdf {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public static deriveKey<Key extends KeyExchange, KW extends KeyWrap>(_options: {
    ephemeralKey: Key
    senderKey?: Key
    recipientKey: Key
    alg: Uint8Array
    apu: Uint8Array
    apv: Uint8Array
    ccTag: Uint8Array
    receive: boolean
  }): KW {
    throw new DIDCommError('deriveKey not implemented on super class')
  }
}

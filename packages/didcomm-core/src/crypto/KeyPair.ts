import type { Jwk } from '../did'

import { DIDCommError } from '../error'

export abstract class KeyPair {
  public publicKey: Uint8Array
  public privateKey?: Uint8Array

  public constructor({ publicKey, privateKey }: { publicKey: Uint8Array; privateKey?: Uint8Array }) {
    this.publicKey = publicKey
    this.privateKey = privateKey
  }

  public abstract sign(message: Uint8Array): Uint8Array

  public static fromJwk(_: Jwk): unknown {
    throw new DIDCommError('fromJwkJson not implemented on base class')
  }

  public static fromSecretBytes(_: Uint8Array): unknown {
    throw new DIDCommError('fromSecretBytes not implemented on base class')
  }
}

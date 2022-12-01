import type { Jwk } from '../did'
import type { FromJwk, KeyExchange, KeyGen, ToJwk } from './JoseKdf'

import { DIDCommError } from '../error'
import { assertCryptoProvider, cryptoProvider } from '../providers'

export class P256KeyPair implements KeyGen, FromJwk, ToJwk, KeyExchange {
  public publicKey: Uint8Array
  public privateKey?: Uint8Array

  public constructor({ publicKey, privateKey }: { publicKey: Uint8Array; privateKey?: Uint8Array }) {
    this.publicKey = publicKey
    this.privateKey = privateKey
  }
  public keyExchange(other: KeyExchange): Uint8Array {
    throw new Error('Method not implemented.')
  }

  // TODO: we can implement this ourselves
  public toJwk(): Record<string, unknown> {
    throw new Error('Method not implemented.')
  }

  // TODO: we can implement this ourselves
  public fromJwk(jwk: Jwk): FromJwk {
    throw new Error('Method not implemented.')
  }

  public generate(): KeyGen {
    throw new Error('Method not implemented.')
  }

  public sign(message: Uint8Array): Uint8Array {
    if (!this.privateKey) throw new DIDCommError('Unable to sign without a private key')
    assertCryptoProvider(['p256'])

    return cryptoProvider.p256!.sign(message, this.privateKey)
  }

  public static fromJwk(jwk: Jwk): P256KeyPair {
    assertCryptoProvider(['p256'])
    return cryptoProvider.p256!.fromJwk(jwk)
  }

  public static fromSecretBytes(secretBytes: Uint8Array): P256KeyPair {
    assertCryptoProvider(['p256'])
    return cryptoProvider.p256!.fromSecretBytes(secretBytes)
  }
}

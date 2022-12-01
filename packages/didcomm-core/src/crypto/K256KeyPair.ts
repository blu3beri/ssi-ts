import type { Jwk } from '../did'

import { DIDCommError } from '../error'
import { assertCryptoProvider, cryptoProvider } from '../providers'

import { KeyPair } from './KeyPair'

export class K256KeyPair extends KeyPair {
  public async sign(message: Uint8Array): Promise<Uint8Array> {
    if (!this.privateKey) throw new DIDCommError('Unable to sign without a private key')
    assertCryptoProvider(['k256'])
    return await cryptoProvider.k256!.sign(message, this.privateKey)
  }

  public static async fromJwk(jwk: Jwk): Promise<K256KeyPair> {
    assertCryptoProvider(['k256'])
    return await cryptoProvider.k256!.fromJwkJson(jwk)
  }

  public static async fromSecretBytes(secretBytes: Uint8Array): Promise<K256KeyPair> {
    assertCryptoProvider(['k256'])
    return await cryptoProvider.k256!.fromSecretBytes(secretBytes)
  }
}

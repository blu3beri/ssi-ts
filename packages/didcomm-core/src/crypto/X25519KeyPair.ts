import { DIDCommError } from '../error'
import { assertCryptoProvider, cryptoProvider } from '../providers'

import { KeyPair } from './KeyPair'

export class X25519KeyPair extends KeyPair {
  public async sign(message: Uint8Array): Promise<Uint8Array> {
    if (!this.privateKey) throw new DIDCommError('Unable to sign without a private key')
    assertCryptoProvider(['x25519'])

    return await cryptoProvider.x25519!.sign(message, this.privateKey)
  }

  public static async fromJwk(jwk: Record<string, unknown>): Promise<X25519KeyPair> {
    assertCryptoProvider(['x25519'])
    return await cryptoProvider.x25519!.fromJwkJson(jwk)
  }

  public static async fromSecretBytes(secretBytes: Uint8Array): Promise<X25519KeyPair> {
    assertCryptoProvider(['x25519'])
    return await cryptoProvider.x25519!.fromSecretBytes(secretBytes)
  }
}

import { Jwk } from '../did'
import { DIDCommError } from '../error'
import { assertCryptoProvider, cryptoProvider } from '../providers'

import { KeyPair } from './KeyPair'

export class Ed25519KeyPair extends KeyPair {
  public async sign(message: Uint8Array): Promise<Uint8Array> {
    if (!this.privateKey) throw new DIDCommError('Unable to sign without a private key')
    assertCryptoProvider(['ed25519'])
    return await cryptoProvider.ed25519!.sign(message, this.privateKey)
  }

  public static async fromJwk(jwk: Jwk): Promise<Ed25519KeyPair> {
    assertCryptoProvider(['ed25519'])
    return await cryptoProvider.ed25519!.fromJwkJson(jwk)
  }

  public static async fromSecretBytes(secretBytes: Uint8Array): Promise<Ed25519KeyPair> {
    assertCryptoProvider(['ed25519'])
    return await cryptoProvider.ed25519!.fromSecretBytes(secretBytes)
  }
}

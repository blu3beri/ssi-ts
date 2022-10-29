import { KeyPair } from './KeyPair'
import { assertCryptoProvider, cryptoProvider } from '../providers'

export class Ed25519 extends KeyPair {
  public type = 'ed25519'

  public async sign(message: Uint8Array): Promise<Uint8Array> {
    assertCryptoProvider(['ed25519'])

    return await cryptoProvider.ed25519!.sign(message)
  }

  public static fromJwkJson(_: Record<string, unknown>): Ed25519 {
    return new Ed25519({ publicKey: new Uint8Array([0]) })
  }
}

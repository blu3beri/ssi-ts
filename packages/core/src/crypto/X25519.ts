import { assertCryptoProvider, cryptoProvider } from '../providers'
import { KeyPair } from './KeyPair'

export class X25519 extends KeyPair {
  public type = 'x25519'

  public async sign(message: Uint8Array): Promise<Uint8Array> {
    assertCryptoProvider(['x25519'])

    return await cryptoProvider.x25519!.sign(message)
  }

  public static fromJwkJson(_: Record<string, unknown>): X25519 {
    return new X25519({ publicKey: new Uint8Array([0]) })
  }
}

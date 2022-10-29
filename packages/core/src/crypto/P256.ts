import { assertCryptoProvider, cryptoProvider } from '../providers'
import { KeyPair } from './KeyPair'

export class P256 extends KeyPair {
  public type = 'p256'

  public async sign(message: Uint8Array): Promise<Uint8Array> {
    assertCryptoProvider(['p256'])

    return await cryptoProvider.p256!.sign(message)
  }

  public static fromJwkJson(_: Record<string, unknown>): P256 {
    return new P256({ publicKey: new Uint8Array([0]) })
  }
}

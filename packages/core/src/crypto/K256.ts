import { assertCryptoProvider, cryptoProvider } from '../providers'
import { KeyPair } from './KeyPair'

export class K256 extends KeyPair {
  public type = 'k256'

  public async sign(message: Uint8Array): Promise<Uint8Array> {
    assertCryptoProvider(['k256'])

    return await cryptoProvider.k256!.sign(message)
  }

  public static fromJwkJson(_: Record<string, unknown>): K256 {
    return new K256({ publicKey: new Uint8Array([0]) })
  }
}

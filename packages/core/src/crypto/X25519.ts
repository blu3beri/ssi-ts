import { assertCryptoProvider, cryptoProvider } from '../providers'
import { KeyPair } from './KeyPair'

export class Xd25519 extends KeyPair {
  public type = 'x25519'

  public async sign(message: Uint8Array): Promise<Uint8Array> {
    assertCryptoProvider(['x25519'])

    return await cryptoProvider.x25519!.sign(message)
  }
}

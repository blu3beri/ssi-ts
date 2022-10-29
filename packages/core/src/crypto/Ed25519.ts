import { KeyPair } from './KeyPair'
import { assertCryptoProvider, cryptoProvider } from '../providers'

export class Ed25519 extends KeyPair {
  public type = 'ed25519'

  public async sign(message: Uint8Array): Promise<Uint8Array> {
    assertCryptoProvider(['ed25519'])

    return await cryptoProvider.ed25519!.sign(message)
  }
}

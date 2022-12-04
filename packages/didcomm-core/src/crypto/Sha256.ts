import { assertCryptoProvider, cryptoProvider } from '../providers'

export class Sha256 {
  public static hash(message: Uint8Array): Uint8Array {
    assertCryptoProvider(['sha256'])
    return cryptoProvider.sha256!.hash(message)
  }
}

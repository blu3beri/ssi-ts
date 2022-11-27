import { assertCryptoProvider, cryptoProvider } from "../providers"
import { KeyPair } from "./KeyPair"

export class K256KeyPair extends KeyPair {
  public async sign(message: Uint8Array): Promise<Uint8Array> {
    assertCryptoProvider(["k256"])
    return await cryptoProvider.k256!.sign(message)
  }

  public static async fromJwkJson(jwk: Record<string, unknown>): Promise<K256KeyPair> {
    assertCryptoProvider(["k256"])
    return await cryptoProvider.k256!.fromJwkJson(jwk)
  }

  public static async fromSecretBytes(secretBytes: Uint8Array): Promise<K256KeyPair> {
    assertCryptoProvider(["k256"])
    return await cryptoProvider.k256!.fromSecretBytes(secretBytes)
  }
}

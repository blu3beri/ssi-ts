import { assertCryptoProvider, cryptoProvider } from "../providers"
import { KeyPair } from "./KeyPair"

export class P256KeyPair extends KeyPair {
  public async sign(message: Uint8Array): Promise<Uint8Array> {
    assertCryptoProvider(["p256"])

    return await cryptoProvider.p256!.sign(message)
  }

  public static async fromJwkJson(jwk: Record<string, unknown>): Promise<P256KeyPair> {
    assertCryptoProvider(["p256"])
    return await cryptoProvider.p256!.fromJwkJson(jwk)
  }

  public static async fromSecretBytes(secretBytes: Uint8Array): Promise<P256KeyPair> {
    assertCryptoProvider(["p256"])
    return await cryptoProvider.p256!.fromSecretBytes(secretBytes)
  }
}

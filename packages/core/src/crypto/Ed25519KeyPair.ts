import { KeyPair } from "./KeyPair"
import { assertCryptoProvider, cryptoProvider } from "../providers"

export class Ed25519KeyPair extends KeyPair {
  public async sign(message: Uint8Array): Promise<Uint8Array> {
    assertCryptoProvider(["ed25519"])
    return await cryptoProvider.ed25519!.sign(message)
  }

  public static async fromJwkJson(jwk: Record<string, unknown>): Promise<Ed25519KeyPair> {
    assertCryptoProvider(["ed25519"])
    return await cryptoProvider.ed25519!.fromJwkJson(jwk)
  }

  public static async fromSecretBytes(secretBytes: Uint8Array): Promise<Ed25519KeyPair> {
    assertCryptoProvider(["ed25519"])
    return await cryptoProvider.ed25519!.fromSecretBytes(secretBytes)
  }
}

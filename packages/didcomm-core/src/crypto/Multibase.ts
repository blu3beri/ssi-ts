import { assertCryptoProvider, cryptoProvider } from '../providers'

export enum Codec {
  X25519Pub = 0xec,
  Ed25519pub = 0xed,
  X25519Priv = 0x1302,
  Ed25519Priv = 0x1200,
}

export class Multibase {
  public static from(value: Uint8Array): { codec: Codec; value: Uint8Array } {
    assertCryptoProvider(['multibase'])
    return cryptoProvider.multibase!.from(value)
  }
}

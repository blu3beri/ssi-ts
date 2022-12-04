import type { KeyAeadParams } from './KeyAeadParams'

export abstract class KeyAead {
  public static aeadPadding = 0

  public abstract aeadParams(): KeyAeadParams

  public abstract encrypt(buf: Uint8Array, nonce: Uint8Array, aad: Uint8Array): number

  public abstract decrypt(buf: Uint8Array, nonce: Uint8Array, aad: Uint8Array): void
}

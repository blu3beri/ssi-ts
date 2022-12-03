import type { Jwk } from '../did'

import { DIDCommError } from '../error'

export abstract class JoseKdf<Key, KW extends KeyWrap> {
  public abstract deriveKey(
    options: {
      ephemeralKey: Key
      senderKey?: Key
      recipientKey: Key
      alg: Uint8Array
      apu: Uint8Array
      apv: Uint8Array
      ccTag: Uint8Array
      receive: boolean
    },
    extra: { kw: KW }
  ): KW
}

export type KeyAeadParams = {
  nonceLength: number
  tagLength: number
}

export abstract class KeyGen {
  public abstract generate(): KeyGen
}

export abstract class ToJwk {
  public abstract toJwk(): Record<string, unknown>
}

export class FromJwk {
  public static fromJwk(jwk: Jwk) {
    throw new DIDCommError('fromJwk not implemented on super class')
  }
}

export abstract class KeyExchange {
  public abstract keyExchange(other: KeyExchange): Uint8Array
}

export abstract class KeyAead {
  public abstract encryptInPlace(options: { nonce: Uint8Array; aad: Uint8Array }): Uint8Array

  public abstract decryptInPlace(options: { nonce: Uint8Array; aad: Uint8Array }): Uint8Array

  public abstract aeadParams(): KeyAeadParams

  public aeadPadding() {
    return 0
  }
}

export abstract class ToSecretBytes {
  public abstract secretBytesLength(): number
  public abstract getSecretBytes(): Uint8Array
}

export abstract class FromSecretBytes {
  public abstract fromSecretBytes(key: Uint8Array): FromSecretBytes
}

export abstract class KeyWrap {
  public abstract wrapKey: <K extends KeyAead & ToSecretBytes>(cipherText: Uint8Array) => K
  public abstract unwrapKey: <K extends KeyAead & FromSecretBytes>(cipherText: Uint8Array) => K
}

export abstract class KeyDerivation {
  public abstract deriveKeyBytes(): Uint8Array
}

export interface FromKeyDerivation {
  fromKeyDerivation<D extends KeyDerivation>(derive: D): FromKeyDerivation
}

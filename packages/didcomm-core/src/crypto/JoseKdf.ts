import type { Jwk } from '../did'

import { DIDCommError } from '../error'

export abstract class JoseKdf {
  public static deriveKey<Key extends KeyExchange, KW extends KeyWrap>(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _options: {
      ephemeralKey: Key
      senderKey?: Key
      recipientKey: Key
      alg: Uint8Array
      apu: Uint8Array
      apv: Uint8Array
      ccTag: Uint8Array
      receive: boolean
    },
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    kw: KW
  ): KW {
    throw new DIDCommError('deriveKey not implemented on super class')
  }
}

export type KeyAeadParams = {
  nonceLength: number
  tagLength: number
}

export interface ToJwk {
  toJwk(): Record<string, unknown>
}

export abstract class KeyGen {
  public static generate(): KeyGen {
    throw new DIDCommError('generate not implemented on super class')
  }
}

export abstract class FromJwk {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public static fromJwk(_jwk: Jwk) {
    throw new DIDCommError('fromJwk not implemented on super class')
  }
}

export interface KeyExchange {
  keyExchange(other: KeyExchange): Uint8Array
}

export abstract class KeyAead {
  public abstract encrypt(options: { buf: Uint8Array; nonce: Uint8Array; aad: Uint8Array }): Uint8Array

  public abstract decrypt(options: { ciphertext: Uint8Array; nonce: Uint8Array; aad: Uint8Array }): Uint8Array

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

export interface KeySecretBytes {
  fromSecretBytes(key: Uint8Array): KeySecretBytes
}

export abstract class FromKeyDerivation {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public static fromKeyDerivation<D extends KeyDerivation>(_derive: D): FromKeyDerivation {
    throw new DIDCommError('fromkeyDerivation is not implemented on super class')
  }
}

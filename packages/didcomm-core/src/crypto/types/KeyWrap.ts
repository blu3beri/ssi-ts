import type { FromSecretBytes } from './FromSecretBytes'
import type { ToSecretBytes } from './ToSecretBytes'

import { KeyAead } from './KeyAead'

export abstract class KeyWrap extends KeyAead {
  public wrapKey<K extends KeyAead & ToSecretBytes>(key: K): Uint8Array {
    const params = this.aeadParams()
    const keyLength = key.secretBytesLength()

    const buf = new Uint8Array(keyLength + params.tagLength)
    key.writeSecretBytes(buf)

    this.encrypt(buf, new Uint8Array(0), new Uint8Array(0))

    return buf
  }

  public unwrapKey<Key extends KeyAead & FromSecretBytes>(
    ciphertext: Uint8Array,
    k: typeof FromSecretBytes,
  ): Key {
    const buf = Uint8Array.from(ciphertext)
    this.decrypt(buf, new Uint8Array(0), new Uint8Array(0))

    const key = k.fromSecretBytes(buf)
    return key as Key
  }
}

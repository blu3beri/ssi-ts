import type { KeyPairProvider } from '@ssi-ts/didcomm-core'

import { X25519KeyPair } from '@ssi-ts/didcomm-core'
import Crypto from 'crypto'

export const x25519: KeyPairProvider<X25519KeyPair> = {
  sign: (message: Uint8Array, privateKey: Uint8Array) =>
    Uint8Array.from(Crypto.sign('x25519', message, Buffer.from(privateKey))),

  verify: (message: Uint8Array, publicKey: Uint8Array, signature: Uint8Array) =>
    Crypto.verify('x25519', message, Buffer.from(publicKey), signature),

  // TODO: derive publicKey from privateKey
  fromSecretBytes: (secretBytes: Uint8Array) =>
    new X25519KeyPair({ publicKey: new Uint8Array([0]), privateKey: secretBytes }),

  generate: () => {
    throw new Error('Function not implemented.')
  },
}

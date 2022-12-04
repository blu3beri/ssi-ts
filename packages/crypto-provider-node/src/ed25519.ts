import type { KeyPairProvider } from '@ssi-ts/didcomm-core'

import { Ed25519KeyPair } from '@ssi-ts/didcomm-core'
import Crypto from 'crypto'

export const ed25519: KeyPairProvider<Ed25519KeyPair> = {
  sign: (message: Uint8Array, privateKey: Uint8Array) =>
    Uint8Array.from(Crypto.sign('ed25519', message, Buffer.from(privateKey))),

  verify: (message: Uint8Array, publicKey: Uint8Array, signature: Uint8Array) =>
    Crypto.verify('ed25519', message, Buffer.from(publicKey), signature),

  // TODO: derive publicKey from privateKey
  fromSecretBytes: (secretBytes: Uint8Array) =>
    new Ed25519KeyPair({ publicKey: new Uint8Array([0]), privateKey: secretBytes }),

  generate: (): Ed25519KeyPair => {
    throw new Error('Function not implemented.')
  },
}

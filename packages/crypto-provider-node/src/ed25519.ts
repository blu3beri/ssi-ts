import Crypto from 'crypto'
import { Ed25519KeyPair, KeyPairProvider } from '@ssi-ts/didcomm-core'
import { Jwk } from '@ssi-ts/didcomm-core'

export const ed25519: KeyPairProvider<Ed25519KeyPair> = {
  sign: (message: Uint8Array, privateKey: Uint8Array) =>
    Uint8Array.from(Crypto.sign('x25519', message, Buffer.from(privateKey))),
  fromJwkJson: (jwk: Jwk) => new Ed25519KeyPair({ publicKey: new Uint8Array([0]) }),
  fromSecretBytes: (secretBytes: Uint8Array) =>
    new Ed25519KeyPair({ publicKey: new Uint8Array([0]), privateKey: secretBytes }),
}

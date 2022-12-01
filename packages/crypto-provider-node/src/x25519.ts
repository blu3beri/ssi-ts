import { Jwk, KeyPairProvider, X25519KeyPair } from '@ssi-ts/didcomm-core'
import Crypto from 'crypto'

export const x25519: KeyPairProvider<X25519KeyPair> = {
  sign: (message: Uint8Array, privateKey: Uint8Array) =>
    Uint8Array.from(Crypto.sign('x25519', message, Buffer.from(privateKey))),
  // TODO: base64url decode x for public and d for private
  // TODO: dervice public from privaye is public is not supplied
  fromJwkJson: (jwk: Jwk) => new X25519KeyPair({ publicKey: new Uint8Array([0]) }),
  fromSecretBytes: (secretBytes: Uint8Array) =>
    new X25519KeyPair({ publicKey: new Uint8Array([0]), privateKey: secretBytes }),
}

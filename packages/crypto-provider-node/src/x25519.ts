import { Jwk, KeyPairProvider, X25519KeyPair } from '@ssi-ts/didcomm-core'
import Crypto from 'crypto'

export const x25519: KeyPairProvider<X25519KeyPair> = {
  sign: (message: Uint8Array, privateKey: Uint8Array) =>
    Uint8Array.from(Crypto.sign('x25519', message, Buffer.from(privateKey))),

  verify: (message: Uint8Array, publicKey: Uint8Array, signature: Uint8Array) =>
    Crypto.verify('x25519', message, Buffer.from(publicKey), signature),

  fromJwkJson: async (jwk: Jwk) => {
    console.log(Buffer.from(jwk.x!, 'base64url'))
    let publicKey = jwk.x ? Uint8Array.from(Buffer.from(jwk.x, 'base64url')) : undefined
    let privateKey = jwk.d ? Uint8Array.from(Buffer.from(jwk.d, 'base64url')) : undefined
    publicKey ??= privateKey ? (await x25519.fromSecretBytes(privateKey)).publicKey : publicKey

    if (!publicKey) {
      // TODO: custom error
      throw new Error("Could not derive public key from private key or 'x' was not supplied in the JWK")
    }

    return new X25519KeyPair({ publicKey, privateKey })
  },

  // TODO: derive publicKey from privateKey
  fromSecretBytes: (secretBytes: Uint8Array) =>
    new X25519KeyPair({ publicKey: new Uint8Array([0]), privateKey: secretBytes }),
}

import Crypto from 'crypto'
import { Ed25519KeyPair, KeyPairProvider } from '@ssi-ts/didcomm-core'
import type { Jwk } from '@ssi-ts/didcomm-core'

export const ed25519: KeyPairProvider<Ed25519KeyPair> = {
  sign: (message: Uint8Array, privateKey: Uint8Array) =>
    Uint8Array.from(Crypto.sign('ed25519', message, Buffer.from(privateKey))),

  verify: (message: Uint8Array, publicKey: Uint8Array, signature: Uint8Array) =>
    Crypto.verify('ed25519', message, Buffer.from(publicKey), signature),

  fromJwkJson: async (jwk: Jwk) => {
    let publicKey = jwk.x ? Uint8Array.from(Buffer.from(jwk.x, 'base64url')) : undefined
    let privateKey = jwk.d ? Uint8Array.from(Buffer.from(jwk.d, 'base64url')) : undefined
    publicKey = !publicKey && privateKey ? (await ed25519.fromSecretBytes(privateKey)).publicKey : undefined

    if (!publicKey) {
      // TODO: custom error
      throw new Error("Could not derive public key from private key or 'x' was not supplied in the JWK")
    }

    return new Ed25519KeyPair({ publicKey, privateKey })
  },

  // TODO: derive publicKey from privateKey
  fromSecretBytes: (secretBytes: Uint8Array) =>
    new Ed25519KeyPair({ publicKey: new Uint8Array([0]), privateKey: secretBytes }),
}

import type { Codec, Ed25519KeyPair, K256KeyPair, P256KeyPair, X25519KeyPair, KeyPair } from '../../crypto'
import type { Jwk } from '../../did'
import type { Args, OrPromise } from '../utils'

type MultibaseFrom = (value: Uint8Array, ...args: Args) => OrPromise<{ codec: Codec; value: Uint8Array }>
type Sign = (message: Uint8Array, privateKey: Uint8Array) => OrPromise<Uint8Array>
type Verify = (message: Uint8Array, publicKey: Uint8Array, signature: Uint8Array) => OrPromise<boolean>
type Hash = (message: Uint8Array) => OrPromise<Uint8Array>
type FromJwkJson<T extends KeyPair> = (jwk: Jwk) => OrPromise<T>
type FromSecretBytes<T extends KeyPair> = (secretBytes: Uint8Array) => OrPromise<T>

// TODO: these should be optional and can be additionally checked
export type KeyPairProvider<T extends KeyPair> = {
  sign: Sign
  verify: Verify
  fromJwkJson: FromJwkJson<T>
  fromSecretBytes: FromSecretBytes<T>
}

export type CryptoProvider = {
  multibase?: {
    from: MultibaseFrom
  }
  sha256?: {
    hash: Hash
  }
  ed25519?: KeyPairProvider<Ed25519KeyPair>
  x25519?: KeyPairProvider<X25519KeyPair>
  k256?: KeyPairProvider<K256KeyPair>
  p256?: KeyPairProvider<P256KeyPair>
}

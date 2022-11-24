import {
  Ed25519KeyPair,
  K256KeyPair,
  P256KeyPair,
  X25519KeyPair,
} from '../../crypto'
import { KeyPair } from '../../crypto/KeyPair'
import { Args, OrPromise } from '../utils'

type Sign = (message: Uint8Array, ...args: Args) => OrPromise<Uint8Array>
type Hash = (message: Uint8Array, ...args: Args) => OrPromise<Uint8Array>
type FromJwkJson<T extends KeyPair> = (
  jwk: Record<string, unknown>,
  ...args: Args
) => OrPromise<T>
type FromSecretBytes<T extends KeyPair> = (
  secretBytes: Uint8Array,
  ...args: Args
) => OrPromise<T>

export type CryptoProvider = {
  sha256?: {
    hash: Hash
  }
  ed25519?: {
    sign: Sign
    fromJwkJson: FromJwkJson<Ed25519KeyPair>
    fromSecretBytes: FromSecretBytes<Ed25519KeyPair>
  }
  x25519?: {
    sign: Sign
    fromJwkJson: FromJwkJson<X25519KeyPair>
    fromSecretBytes: FromSecretBytes<X25519KeyPair>
  }
  k256?: {
    sign: Sign
    fromJwkJson: FromJwkJson<K256KeyPair>
    fromSecretBytes: FromSecretBytes<K256KeyPair>
  }
  p256?: {
    sign: Sign
    fromJwkJson: FromJwkJson<P256KeyPair>
    fromSecretBytes: FromSecretBytes<P256KeyPair>
  }
}

import type { Codec, Ed25519KeyPair, K256KeyPair, P256KeyPair, X25519KeyPair, KeyPair } from '../../crypto'
import type { SignatureType } from '../../utils'

type MultibaseFrom = (value: Uint8Array) => { codec: Codec; value: Uint8Array }
type Sign = (message: Uint8Array, privateKey: Uint8Array, signatureType?: SignatureType) => Uint8Array
type Verify = (message: Uint8Array, publicKey: Uint8Array, signature: Uint8Array) => boolean
type Hash = (message: Uint8Array) => Uint8Array
type FromSecretBytes<T extends KeyPair> = (secretBytes: Uint8Array) => T

// TODO: these should be optional and can be additionally checked
export type KeyPairProvider<T extends KeyPair> = {
  sign: Sign
  verify: Verify
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

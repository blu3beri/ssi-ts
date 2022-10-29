import { Args, OrPromise } from '../utils'

type Hash = (message: Uint8Array, ...args: Args) => OrPromise<Uint8Array>
type Sign = (message: Uint8Array, ...args: Args) => OrPromise<Uint8Array>

export type CryptoProvider = {
  sha256?: {
    hash: Hash
  }
  ed25519?: {
    sign: Sign
  }
  x25519?: {
    sign: Sign
  }
  k256?: {
    sign: Sign
  }
  p256?: {
    sign: Sign
  }
}

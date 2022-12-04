import type { Jwk } from '../did'
import type { SignatureType } from '../utils';
import type { FromPublicBytes, FromJwk, FromSecretBytes, KeySign, ToJwk } from './types'

import { DIDCommError } from '../error'
import { assertCryptoProvider, cryptoProvider } from '../providers'
import { b64UrlSafe } from '../utils'

import { KeyPair } from './KeyPair'

const PUBLIC_KEY_LENGTH = 32
const PRIVATE_KEY_LENGTH = 32

export class Ed25519KeyPair extends KeyPair implements ToJwk, FromJwk, FromSecretBytes, FromPublicBytes, KeySign {
  public static fromSecretBytes(secretBytes: Uint8Array): Ed25519KeyPair {
    if (secretBytes.length !== PRIVATE_KEY_LENGTH) throw new DIDCommError('Invalid key data')
    assertCryptoProvider(['ed25519'])
    return cryptoProvider.ed25519!.fromSecretBytes(secretBytes)
  }

  public static fromPublicBytes(publicBytes: Uint8Array): Ed25519KeyPair {
    if (publicBytes.length !== PUBLIC_KEY_LENGTH) throw new DIDCommError('Invalid key data')
    return new Ed25519KeyPair({ publicKey: publicBytes })
  }

  public static fromJwk(jwk: Jwk): Ed25519KeyPair {
    if (jwk.d) {
      const kp = b64UrlSafe.decode(jwk.d)
      return Ed25519KeyPair.fromSecretBytes(kp)
    } else if (jwk.x) {
      const kp = b64UrlSafe.decode(jwk.x)
      return Ed25519KeyPair.fromPublicBytes(kp)
    }
    throw new DIDCommError("Either 'x' or 'd' has to be defined o the Jwk to create a key")
  }

  public tojwk(): Jwk {
    throw new Error('Method not implemented.')
  }

  public sign(message: Uint8Array, signatureType?: SignatureType | undefined): Uint8Array {
    if (!this.privateKey) throw new DIDCommError('Unable to sign without a private key')
    assertCryptoProvider(['ed25519'])
    return cryptoProvider.ed25519!.sign(message, this.privateKey, signatureType)
  }
}

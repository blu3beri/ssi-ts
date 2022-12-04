import type { Jwk } from '../did'
import type { SignatureType } from '../utils'
import type { FromPublicBytes, FromJwk, FromSecretBytes, KeySign, ToJwk, KeyExchange } from './types'
import type { KeyGen } from './types/KeyGen'

import { DIDCommError } from '../error'
import { assertCryptoProvider, cryptoProvider } from '../providers'
import { b64UrlSafe } from '../utils'

import { KeyPair } from './KeyPair'

const PUBLIC_KEY_LENGTH = 32
const PRIVATE_KEY_LENGTH = 32

export class X25519KeyPair
  extends KeyPair
  implements ToJwk, FromJwk, FromSecretBytes, FromPublicBytes, KeySign, KeyExchange, KeyGen
{
  public static generate(): X25519KeyPair {
    assertCryptoProvider(['x25519'])
    return cryptoProvider.x25519!.generate()
  }

  public static fromSecretBytes(secretBytes: Uint8Array): X25519KeyPair {
    if (secretBytes.length !== PRIVATE_KEY_LENGTH) throw new DIDCommError('Invalid key data')
    assertCryptoProvider(['x25519'])
    return cryptoProvider.x25519!.fromSecretBytes(secretBytes)
  }

  public static fromPublicBytes(publicBytes: Uint8Array): X25519KeyPair {
    if (publicBytes.length !== PUBLIC_KEY_LENGTH) throw new DIDCommError('Invalid key data')
    return new X25519KeyPair({ publicKey: publicBytes })
  }

  public static fromJwk(jwk: Jwk): X25519KeyPair {
    if (jwk.d) {
      const kp = b64UrlSafe.decode(jwk.d)
      return X25519KeyPair.fromSecretBytes(kp)
    } else if (jwk.x) {
      const kp = b64UrlSafe.decode(jwk.x)
      return X25519KeyPair.fromPublicBytes(kp)
    }
    throw new DIDCommError("Either 'x' or 'd' has to be defined o the Jwk to create a key")
  }

  public tojwk(): Jwk {
    throw new Error('Method not implemented.')
  }

  public sign(message: Uint8Array, signatureType?: SignatureType): Uint8Array {
    if (!this.privateKey) throw new DIDCommError('Unable to sign without a private key')
    assertCryptoProvider(['x25519'])
    return cryptoProvider.x25519!.sign(message, this.privateKey, signatureType)
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public writeKeyExchange(_other: KeyExchange): Uint8Array {
    throw new Error('Method not implemented.')
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public keyExchangeBytes(_other: KeyExchange): Uint8Array {
    throw new Error('Method not implemented.')
  }
}

import type { Jwk } from '../did'
import type { SignatureType } from '../utils';
import type { FromJwk, FromSecretBytes, KeySign } from './types'

import { DIDCommError } from '../error'
import { assertCryptoProvider, cryptoProvider } from '../providers'
import { b64UrlSafe } from '../utils'

import { KeyPair } from './KeyPair'

const PUBLIC_KEY_LENGTH = 33
const PRIVATE_KEY_LENGTH = 32

export class K256KeyPair extends KeyPair implements FromJwk, FromSecretBytes, KeySign {
  public static fromSecretBytes(secretBytes: Uint8Array): K256KeyPair {
    if (secretBytes.length !== PRIVATE_KEY_LENGTH) throw new DIDCommError('Invalid key data')
    assertCryptoProvider(['k256'])
    return cryptoProvider.k256!.fromSecretBytes(secretBytes)
  }

  public static fromPublicBytes(publicBytes: Uint8Array): K256KeyPair {
    if (publicBytes.length !== PUBLIC_KEY_LENGTH) throw new DIDCommError('Invalid key data')
    return new K256KeyPair({ publicKey: publicBytes })
  }

  public static fromJwk(jwk: Jwk): K256KeyPair {
    if (jwk.d) {
      const kp = b64UrlSafe.decode(jwk.d)
      return K256KeyPair.fromSecretBytes(kp)
    } else if (jwk.x) {
      const kp = b64UrlSafe.decode(jwk.x)
      return K256KeyPair.fromPublicBytes(kp)
    }
    throw new DIDCommError("Either 'x' or 'd' has to be defined o the Jwk to create a key")
  }

  public tojwk(): Jwk {
    throw new Error('Method not implemented.')
  }

  public sign(message: Uint8Array, signatureType?: SignatureType): Uint8Array {
    if (!this.privateKey) throw new DIDCommError('Unable to sign without a private key')
    assertCryptoProvider(['k256'])
    return cryptoProvider.k256!.sign(message, this.privateKey, signatureType)
  }
}

import type { Jwk, VerificationMethod } from '../DidDocument'

import { Ed25519KeyPair, K256KeyPair, P256KeyPair, X25519KeyPair, Codec, Multibase } from '../../crypto'
import { DIDCommError } from '../../error'
import { b58, b64UrlSafe } from '../../utils'
import { VerificationMethodType } from '../DidDocument'

export const verificationMethodAsKeypair = async ({
  type,
  publicKeyJwk,
  publicKeyMultibase,
  publicKeyHex,
  publicKeyBase58,
}: VerificationMethod) => {
  if ([publicKeyJwk, publicKeyMultibase, publicKeyHex, publicKeyBase58].filter(Boolean).length !== 1) {
    throw new DIDCommError(
      'One and only one of the following properties has to be defined on the verificaton method: publicKeyJwk, publicKeyMultibase, publicKeyHex, publicKeyBase58'
    )
  }

  if (type === VerificationMethodType.JsonWebKey2020 && publicKeyJwk) {
    const { kty, crv } = publicKeyJwk
    if (kty === 'EC' && crv === 'P-256') {
      return P256KeyPair.fromJwk(publicKeyJwk)
    }
    if (kty === 'EC' && crv === 'secp256k1') {
      return K256KeyPair.fromJwk(publicKeyJwk)
    }
    if (kty === 'OKP' && crv === 'Ed25519') {
      return Ed25519KeyPair.fromJwk(publicKeyJwk)
    }
    if (kty === 'OKP' && crv === 'X25519') {
      return X25519KeyPair.fromJwk(publicKeyJwk)
    }
    throw new DIDCommError('Unsupported key type or curve')
  }

  if (type === VerificationMethodType.X25519KeyAgreement2019 && publicKeyBase58) {
    const decodedValue = b58.decode(publicKeyBase58)
    const base64UrlValue = b64UrlSafe.encode(decodedValue)

    const jwk: Jwk = {
      kty: 'OKP',
      crv: 'X25519',
      x: base64UrlValue,
    }

    return X25519KeyPair.fromJwk(jwk)
  }

  if (type === VerificationMethodType.Ed25519VerificationKey2018 && publicKeyBase58) {
    const decodedValue = b58.decode(publicKeyBase58)
    const base64UrlValue = b64UrlSafe.encode(decodedValue)

    const jwk: Jwk = {
      kty: 'OKP',
      crv: 'Ed25519',
      x: base64UrlValue,
    }

    return Ed25519KeyPair.fromJwk(jwk)
  }

  if (type === VerificationMethodType.X25519KeyAgreementKey2020 && publicKeyMultibase) {
    if (!publicKeyMultibase.startsWith('z')) {
      throw new DIDCommError("Multibase value must start with 'z'")
    }

    const b58DecodedValue = b58.decode(publicKeyMultibase.slice(1))
    const { codec, value: decodedValue } = await Multibase.from(b58DecodedValue)

    if (codec !== Codec.Ed25519Priv) {
      throw new DIDCommError(`wrong codec in multibase secret material. Expected ${Codec.Ed25519Priv}, got ${codec}`)
    }

    const base64UrlSafeValue = b64UrlSafe.encode(decodedValue)

    const jwk: Jwk = {
      kty: 'OKP',
      crv: 'X25519',
      x: base64UrlSafeValue,
    }

    return X25519KeyPair.fromJwk(jwk)
  }

  if (type === VerificationMethodType.Ed25519VerificationKey2020 && publicKeyMultibase) {
    if (!publicKeyMultibase.startsWith('z')) {
      throw new DIDCommError("Multibase value must start with 'z'")
    }

    const b58DecodedValue = b58.decode(publicKeyMultibase.slice(1))
    const { codec, value: decodedValue } = await Multibase.from(b58DecodedValue)
    if (codec !== Codec.Ed25519pub) {
      throw new DIDCommError(`wrong codec in multibase secret material. Expected ${Codec.Ed25519pub}, got ${codec}`)
    }
    const base64UrlSafeValue = b64UrlSafe.encode(decodedValue)

    const jwk: Jwk = {
      kty: 'OKP',
      crv: 'Ed25519',
      x: base64UrlSafeValue,
    }

    return Ed25519KeyPair.fromJwk(jwk)
  }

  throw new DIDCommError('Unsupported verification method type and material combination')
}

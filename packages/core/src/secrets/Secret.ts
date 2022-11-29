import base58 from 'bs58'

import { Ed25519KeyPair, K256KeyPair, KnownKeyAlgorithm, P256KeyPair, X25519KeyPair } from '../crypto'
import { DIDCommError } from '../error'
import { b58, b64UrlSafe, Codec, fromMulticodec } from '../utils/'

export enum SecretType {
  JsonWebKey2020,
  X25519KeyAgreementKey2019,
  X25519KeyAgreementKey2020,
  Ed25519VerificationKey2018,
  Ed25519VerificationKey2020,
  EcdsaSecp256k1verificationKey2019,
}

export enum SecretMaterialType {
  Jwk = 'JWK',
  Multibase = 'Multibase',
  Base58 = 'base58',
  Hex = 'Hex',
  Other = 'Other',
}

export type SecretMaterial<V = Record<string, unknown>> = {
  type: SecretMaterialType
  value: V
}

export class Secret {
  public id: string
  public type: SecretType
  public secretMaterial: SecretMaterial | SecretMaterial<string>

  public constructor({
    id,
    type,
    secretMaterial,
  }: {
    id: string
    type: SecretType
    secretMaterial: SecretMaterial | SecretMaterial<string>
  }) {
    this.id = id
    this.type = type
    this.secretMaterial = secretMaterial
  }

  public keyAlgorithm(): KnownKeyAlgorithm {
    if (this.type === SecretType.JsonWebKey2020 && this.secretMaterial.type === 'JWK') {
      const kty = (this.secretMaterial.value as Record<string, unknown>).kty
      const crv = (this.secretMaterial.value as Record<string, unknown>).crv
      if (!kty || !crv) return KnownKeyAlgorithm.Unsupported

      if (kty === 'EC') {
        if (crv === 'P-256') return KnownKeyAlgorithm.P256
        if (crv === 'secp256k1') return KnownKeyAlgorithm.P256
      }

      if (kty === 'OKP') {
        if (crv === 'Ed25519') return KnownKeyAlgorithm.Ed25519
        if (crv === 'X25519') return KnownKeyAlgorithm.X25519
      }
    }

    if (this.type === SecretType.X25519KeyAgreementKey2019 && this.secretMaterial.type === SecretMaterialType.Base58) {
      return KnownKeyAlgorithm.X25519
    }

    if (
      this.type === SecretType.Ed25519VerificationKey2018 &&
      this.secretMaterial.type === SecretMaterialType.Multibase
    ) {
      return KnownKeyAlgorithm.Ed25519
    }

    if (
      this.type === SecretType.X25519KeyAgreementKey2020 &&
      this.secretMaterial.type === SecretMaterialType.Multibase
    ) {
      return KnownKeyAlgorithm.X25519
    }

    if (
      this.type === SecretType.Ed25519VerificationKey2020 &&
      this.secretMaterial.type === SecretMaterialType.Multibase
    ) {
      return KnownKeyAlgorithm.Ed25519
    }

    return KnownKeyAlgorithm.Unsupported
  }

  public async asKeyPair() {
    const value = this.secretMaterial.value as Record<string, unknown>
    if (this.type === SecretType.JsonWebKey2020 && this.secretMaterial.type === SecretMaterialType.Jwk) {
      const kty = value.kty
      const crv = value.crv

      if (kty === 'EC') {
        if (crv === 'P-256') return P256KeyPair.fromJwk(value)
        if (crv === 'secp256k1') return K256KeyPair.fromJwk(value)
      }

      if (kty === 'OKP') {
        if (crv === 'Ed25519') return Ed25519KeyPair.fromJwk(value)
        if (crv === 'X25519') return X25519KeyPair.fromJwk(value)
      }

      throw new DIDCommError('Unsupported key type or curve.')
    }

    if (this.type === SecretType.X25519KeyAgreementKey2019 && this.secretMaterial.type === SecretMaterialType.Base58) {
      const decodedValue = b58.decode(this.secretMaterial.value as string)

      const keyPair = await X25519KeyPair.fromSecretBytes(decodedValue)

      const jwk = {
        kty: 'OKP',
        crv: 'X25519',
        x: b64UrlSafe.encode(keyPair.publicKey),
        d: keyPair.privateKey ? b64UrlSafe.encode(keyPair.privateKey) : undefined,
      }

      return X25519KeyPair.fromJwk(jwk)
    }

    if (this.type === SecretType.Ed25519VerificationKey2018 && this.secretMaterial.type === SecretMaterialType.Base58) {
      const decodedValue = b58.decode(this.secretMaterial.value as string)
      const curve25519PointSize = 32
      const dValue = decodedValue.slice(0, curve25519PointSize)
      const xValue = decodedValue.slice(curve25519PointSize, 0)

      const jwk = {
        crv: 'Ed25519',
        x: b64UrlSafe.encode(xValue),
        d: b64UrlSafe.encode(dValue),
      }

      return Ed25519KeyPair.fromJwk(jwk)
    }

    if (
      this.type === SecretType.X25519KeyAgreementKey2020 &&
      this.secretMaterial.type === SecretMaterialType.Multibase
    ) {
      const value = this.secretMaterial.value as string
      if (!value.startsWith('z')) {
        throw new DIDCommError("Multibase must start with 'z'")
      }

      const b58DecodedValue = b58.decode(value.slice(1))
      const { codec, decodedValue } = fromMulticodec({ codec: Codec.X25519Priv, decodedValue: b58DecodedValue })

      if (codec !== Codec.X25519Priv) {
        throw new DIDCommError(`wrong codec in multibase secret material. Expected ${Codec.X25519Priv}, got ${codec}`)
      }

      const keyPair = await X25519KeyPair.fromSecretBytes(decodedValue)

      const jwk = {
        kty: 'OKP',
        crv: 'X25519',
        x: b64UrlSafe.encode(keyPair.publicKey),
        d: keyPair.privateKey ? b64UrlSafe.encode(keyPair.privateKey) : undefined,
      }

      return X25519KeyPair.fromJwk(jwk)
    }

    if (
      this.type === SecretType.Ed25519VerificationKey2020 &&
      // TODO: why this this incorrect?
      this.secretMaterial.type === SecretMaterialType.Multibase
    ) {
      const value = this.secretMaterial.value as string
      if (!value.startsWith('z')) {
        throw new DIDCommError("Multibase must start with 'z'")
      }

      const b58Decodedvalue = base58.decode(value.slice(1))
      const { codec, decodedValue } = fromMulticodec({ codec: Codec.Ed25519Priv, decodedValue: b58Decodedvalue })

      if (codec !== Codec.Ed25519Priv) {
        throw new DIDCommError(`wrong codec in multibase secret material. Expected ${Codec.Ed25519Priv}, got ${codec}`)
      }

      const keyPair = await Ed25519KeyPair.fromSecretBytes(decodedValue)

      const jwk = {
        kty: 'OKP',
        crv: 'Ed25519',
        x: b64UrlSafe.encode(keyPair.publicKey),
        d: keyPair.privateKey ? b64UrlSafe.encode(keyPair.privateKey) : undefined,
      }

      return Ed25519KeyPair.fromJwk(jwk)
    }

    throw new DIDCommError('Unsupported secret method and material combination')
  }
}

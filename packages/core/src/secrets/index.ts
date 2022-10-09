import base58 from 'bs58'
import { DIDCommError } from '../error'
import {
  KnownKeyAlgorithm,
  AsKnownKeyPair,
  Ed25519KeyPair,
  K256KeyPair,
  KnownKeyPair,
  P256KeyPair,
  X25519KeyPair,
  b58,
  b64,
  b64UrlSafe,
  Codec,
} from '../utils/'

export type SecretsResolver = {
  getSecret(secretId: string): Promise<Secret | undefined>
  findSecrets(secretIds: Array<string>): Promise<Array<Secret>>
}

export class Secret {
  id: string
  type: SecretType
  secretMaterial: SecretMaterial | SecretMaterial<string>

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
    if (
      this.type === SecretType.JsonWebKey2020 &&
      this.secretMaterial.type === 'JWK'
    ) {
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

    if (
      this.type === SecretType.X25519KeyAgreementKey2019 &&
      this.secretMaterial.type === 'Base58'
    ) {
      return KnownKeyAlgorithm.X25519
    }

    if (
      this.type === SecretType.Ed25519VerificationKey2018 &&
      this.secretMaterial.type === 'Multibase'
    ) {
      return KnownKeyAlgorithm.Ed25519
    }

    if (
      this.type === SecretType.X25519KeyAgreementKey2020 &&
      this.secretMaterial.type === 'Multibase'
    ) {
      return KnownKeyAlgorithm.X25519
    }

    if (
      this.type === SecretType.Ed25519VerificationKey2020 &&
      this.secretMaterial.type === 'Multibase'
    ) {
      return KnownKeyAlgorithm.Ed25519
    }

    return KnownKeyAlgorithm.Unsupported
  }

  public asKeyPair(): KnownKeyPair {
    const value = this.secretMaterial.value as Record<string, unknown>
    if (
      this.type === SecretType.JsonWebKey2020 &&
      this.secretMaterial.type === 'JWK'
    ) {
      const kty = value.kty
      const crv = value.crv

      if (kty === 'EC') {
        if (crv === 'P-256') {
          return {
            type: 'P256',
            keyPair: P256KeyPair.fromJwkJson(value),
          }
        }
        if (crv === 'secp256k1') {
          return {
            type: 'K256',
            keyPair: K256KeyPair.fromJwkJson(value),
          }
        }
      }

      if (kty === 'OKP') {
        if (crv === 'Ed25519') {
          return {
            type: 'Ed25519',
            keyPair: Ed25519KeyPair.fromJwkJson(value),
          }
        }
        if (crv === 'X25519') {
          return {
            type: 'X25519',
            keyPair: X25519KeyPair.fromJwkJson(value),
          }
        }
      }

      throw new DIDCommError(`Unsupported key type or curve.`)
    }

    if (
      this.type === SecretType.X25519KeyAgreementKey2019 &&
      this.secretMaterial.type === 'Base58'
    ) {
      const decodedValue = b58.decode(this.secretMaterial.value as string)

      const keyPair = X25519KeyPair.fromSecretBytes(decodedValue)

      const jwk = {
        kty: 'OKP',
        crv: 'X25519',
        x: b64UrlSafe.encode(keyPair.publicKey),
        d: keyPair.secretKey ? b64UrlSafe.encode(keyPair.secretKey) : undefined,
      }

      return { type: 'X25519', keyPair: X25519KeyPair.fromJwkJson(jwk) }
    }

    if (
      this.type === SecretType.Ed25519VerificationKey2018 &&
      this.secretMaterial.type === 'Base58'
    ) {
      const decodedValue = b58.decode(this.secretMaterial.value as string)
      const curve25519PointSize = 32
      const dValue = decodedValue.slice(0, curve25519PointSize)
      const xValue = decodedValue.slice(curve25519PointSize, 0)

      const jwk = {
        crv: 'Ed25519',
        x: b64UrlSafe.encode(xValue),
        d: b64UrlSafe.encode(dValue),
      }

      return { type: 'Ed25519', keyPair: Ed25519KeyPair.fromJwkJson(jwk) }
    }

    if (
      (this.type === SecretType.X25519KeyAgreementKey2020,
      this.secretMaterial.type === 'Multibase')
    ) {
      const value = this.secretMaterial.value as string
      if (!value.startsWith('z')) {
        throw new DIDCommError("Multibase must start with 'z'")
      }

      const decodedMultibaseValue = b58.decode(value.slice(1))

      // TODO: implement from multicodec properly
      const fromMulticodec = () => ({
        codec: Codec.X25519Priv,
        decodedValue: new Uint8Array([1, 2, 4]),
      })
      const { codec, decodedValue } = fromMulticodec()

      if (codec !== Codec.X25519Priv) {
        throw new DIDCommError(
          `wrong codec in multibase secret material. Expected ${Codec.X25519Priv}, got ${codec}`
        )
      }

      const keyPair = X25519KeyPair.fromSecretBytes(decodedValue)

      const jwk = {
        kty: 'OKP',
        crv: 'X25519',
        x: b64UrlSafe.encode(keyPair.publicKey),
        d: keyPair.secretKey ? b64UrlSafe.encode(keyPair.secretKey) : undefined,
      }

      return { type: 'X25519', keyPair: X25519KeyPair.fromJwkJson(jwk) }
    }

    if (
      this.type === SecretType.Ed25519VerificationKey2020 &&
      // TODO: why this this incorrect?
      this.secretMaterial.type === 'Multibase'
    ) {
      const value = this.secretMaterial.value as string
      if (!value.startsWith('z')) {
        throw new DIDCommError("Multibase must start with 'z'")
      }

      const decodedMultibaseValue = base58.decode(value.slice(1))

      // TODO: implement from multicodec properly
      const fromMulticodec = () => ({
        codec: Codec.Ed25519Priv,
        decodedValue: new Uint8Array([1, 2, 4]),
      })
      const { codec, decodedValue } = fromMulticodec()

      if (codec !== Codec.Ed25519Priv) {
        throw new DIDCommError(
          `wrong codec in multibase secret material. Expected ${Codec.Ed25519Priv}, got ${codec}`
        )
      }

      const keyPair = Ed25519KeyPair.fromSecretBytes(decodedValue)

      const jwk = {
        kty: 'OKP',
        crv: 'Ed25519',
        x: b64UrlSafe.encode(keyPair.publicKey),
        d: keyPair.secretKey ? b64UrlSafe.encode(keyPair.secretKey) : undefined,
      }

      return { type: 'Ed25519', keyPair: Ed25519KeyPair.fromJwkJson(jwk) }
    }

    throw new DIDCommError('Unsupported secret method and material combination')
  }
}

export enum SecretType {
  JsonWebKey2020,
  X25519KeyAgreementKey2019,
  X25519KeyAgreementKey2020,
  Ed25519VerificationKey2018,
  Ed25519VerificationKey2020,
  EcdsaSecp256k1verificationKey2019,
}

export type SecretMaterial<
  V = Record<string, unknown>,
  T extends 'JWK' | 'Multibase' | 'Base58' | 'Hex' | 'Other' =
    | 'JWK'
    | 'Multibase'
    | 'Base58'
    | 'Hex'
    | 'Other'
> = {
  type: T
  value: V
}

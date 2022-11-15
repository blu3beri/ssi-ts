export type DIDDocument = {
  id: string
  alsoKnownAs?: Array<string>
  controller?: string | Array<string>
  authentication?: Array<VerificationMethod | string>
  verificationMethod?: Array<VerificationMethod>
  assertionMethod?: Array<VerificationMethod | string>
  capibilityInvocation?: Array<VerificationMethod | string>
  capibilityDelegation?: Array<VerificationMethod | string>
  keyAgreement?: Array<VerificationMethod | string>
  service?: Array<Service>
}

export type VerificationMethod = {
  id: string
  controller: string
  type:
    | 'JsonWebKey2020'
    | 'X25519KeyAgreement2019'
    | 'Ed25519VerificationKey2018'
    | 'EcdsaSecp256k1VerificationKey2019'
    | 'X25519KeyAgreementKey2020'
    | 'Ed25519VerificationKey2020'
  publicKeyJwk?: PublicKeyJwk
  publicKeyMultibase?: string
}

export type PublicKeyJwk = {
  kty?: 'EC' | 'RSA' | 'oct' | 'OKP'
  crv?: 'P-256' | 'P-384' | 'P-521' | 'X25519' | 'Ed25519' | 'secp256k1'
  d?: string
  x?: string
  y?: string
  use?: 'sig' | 'enc'
  key_ops?: Array<
    | 'sign'
    | 'verify'
    | 'encrypt'
    | 'decrypt'
    | 'wrapKey'
    | 'unwrapKey'
    | 'deriveKey'
    | 'deriveBits'
  >
  alg?: 'ECDH-ES+A256KW' | 'ECDH-1PU+A256KW'
  kid?: string
}

// TODO: fix the "kind" here
export type Service = {
  id: string
  type: 'DIDCommMessaging'
  serviceEndpoint: ServiceEndpoint
}

export type ServiceEndpoint = {
  uri: string
  accept?: Array<string>
  routingKeys?: Array<string>
}

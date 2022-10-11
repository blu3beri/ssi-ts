export type DIDDocument = {
  id: string
  alsoKnownAs?: Array<string>
  controller?: string | Array<string>
  authentication?: Array<string>
  verificationMethod?: Array<VerificationMethod>
  assertionMethod?: Array<VerificationMethod>
  capibilityInvocation?: Array<VerificationMethod>
  capibilityDelegation?: Array<VerificationMethod>
  keyAgreement?: Array<VerificationMethod>
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
  crv?: 'P-256' | 'P-384' | 'P-521' | 'X25519'
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

type Service = {
  id: string
  type: string | Array<string>
  serviceEndpoint: string | Array<string> | Array<ServiceEndpoint>
}

type ServiceEndpoint = {
  uri: string
  accept?: Array<string>
  routingKeys?: Array<string>
}


export type DIDDoc = {
  did: string
  keyAgreement: Array<string>
  authentications: Array<string>
  verificationMethods: Array<VerificationMethod>
  services: Array<Service>
}

export type VerificationMethod = {
  id: string
  type: VerificationMethodType
  controller: string
  verificationMaterial: VerificationMaterial
}

export enum VerificationMethodType {
  JsonWebKey2020,
  X25519KeyAgreementKey2019,
  Ed25519VerificationKey2018,
  EcdsaSecp256k1verificationKey2019,
  X25519KeyAgreementKey2020,
  Ed25519VerificationKey2020,
  Other,
}

export type VerificationMaterial = {
  JWK: { value: Record<string, unknown> }
  Multibase: { value: string }
  Base58: { value: string }
  Hex: { value: string }
  Other: { Value: Record<string, unknown> }
}

export type Service = {
  id: string
  kind: ServiceKind
}

export type ServiceKind = {
  DIDCommMessaging: {
    value: DIDCommMessagingService
  }
  Other: {
    value: Record<string, unknown>
  }
}

export type DIDCommMessagingService = {
  serviceEndpoint: string
  accept?: Array<string>
  routingKeys: Array<string>
}

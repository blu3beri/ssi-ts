export type Signature = {
  header: Header
  protected: string
  signature: string
}

export type ProtectedHeader = {
  typ: string
  algorithm: Algorithm
}

export type Header = {
  kid: string
}

export type CompactHeader = {
  typ: string
  algorithm: JWSAlgorithm
  kid: string
}

// TODO: Askar_crypto::sign::SignatureType
export type SignatureType = 'EdDSA' | 'ES256' | 'ES256K' | string

export type JWSAlgorithm = 'EdDSA' | 'ES256' | 'ES256K'

export class JWS {
  signatures: Array<Signature>
  payload: string
}

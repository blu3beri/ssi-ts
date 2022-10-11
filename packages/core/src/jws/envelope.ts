export type Signature = {
  header: Header
  protected: string
  signature: string
}

export type ProtectedHeader = {
  typ: string
  alg: JWSAlgorithm
}

export type Header = {
  kid: string
}

export type CompactHeader = {
  typ: string
  alg: JWSAlgorithm
  kid: string
}

export enum JWSAlgorithm {
  EdDSA = 'EdDSA',
  'Es256' = 'ES256',
  'Es256K' = 'ES256K',
}


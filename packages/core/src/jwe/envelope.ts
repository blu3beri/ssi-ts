export type ProtectedHeader = {
  typ?: string
  alg: JweAlgorithm
  enc: EncAlgorithm
  skid?: string
  apu?: string
  apv: string
  epk: Record<string, unknown>
}

export type Recipient = {
  header: PerRecipientHeader
  encryptedKey: string
}

type PerRecipientHeader = {
  kid: string
}

export enum JweAlgorithm {
  Ecdh1puA256Kw = 'ECDH-1PU+A256KW',
  EcdhEsA256Kw = 'ECDH-ES+A256KW',
}

export enum EncAlgorithm {
  A256cbcHs512 = 'A256CBC-HS512',
  Xc20P = 'XC20P',
  A256Gcm = 'A256GCM',
}

import { DIDCommError } from "../error"
import { SignatureType } from "../utils"

export type Signature = {
  header: Header
  protected: string
  signature: string
}

export type ProtectedHeader = {
  typ: string
  alg: JwsAlgorithm
}

export type Header = {
  kid: string
}

export type CompactHeader = {
  typ: string
  alg: JwsAlgorithm
  kid: string
}

export enum JwsAlgorithm {
  EdDSA = "EdDSA",
  "Es256" = "ES256",
  "Es256K" = "ES256K",
}

export const JWSAlgorithmToSignatureType = (jwsAlgorithm: JwsAlgorithm): SignatureType => {
  switch (jwsAlgorithm) {
    case JwsAlgorithm.EdDSA:
      return SignatureType.EdDSA
    case JwsAlgorithm.Es256:
      return SignatureType.ES256
    case JwsAlgorithm.Es256K:
      return SignatureType.ES256K
    default:
      throw new DIDCommError(`Unsupported signature type: ${jwsAlgorithm}`)
  }
}

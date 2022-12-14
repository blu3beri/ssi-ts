import type { SignatureType } from '../utils'
import type { CompactHeader, JwsAlgorithm, ProtectedHeader, Signature } from './envelope'

import { Buffer } from 'buffer'

import { b64UrlSafe } from '../utils'

import { Jws } from './Jws'
import { JwsAlgorithmToSignatureType } from './envelope'

export type Signer = {
  sign(input: Uint8Array, signatureType?: SignatureType): Uint8Array
}

export const sign = ({
  payload,
  alg,
  signer,
}: {
  payload: Uint8Array
  signer: { kid: string; signer: Signer }
  alg: JwsAlgorithm
}): string => {
  const { signer: key, kid } = signer
  const sigType = JwsAlgorithmToSignatureType(alg)

  const protectedHeader: ProtectedHeader = {
    alg,
    typ: 'application/didcomm-signed+json',
  }

  const serializedProtected = JSON.stringify(protectedHeader)

  const encodedProtected = b64UrlSafe.encode(serializedProtected)
  const encodedPayload = b64UrlSafe.encode(payload)

  const signInput = `${encodedProtected}.${encodedPayload}`
  const signatureBytes = key.sign(Uint8Array.from(Buffer.from(signInput)), sigType)

  const encodedSignature = b64UrlSafe.encode(signatureBytes)

  const signature: Signature = {
    header: { kid },
    protected: encodedProtected,
    signature: encodedSignature,
  }

  const jws = new Jws({
    payload: encodedPayload,
    signatures: [signature],
  })

  return JSON.stringify(jws)
}

export const signCompact = ({
  typ,
  signer,
  payload,
  alg,
}: {
  payload: Uint8Array
  signer: { kid: string; signer: Signer }
  typ: string
  alg: JwsAlgorithm
}): string => {
  const { signer: key, kid } = signer
  const sigType = JwsAlgorithmToSignatureType(alg)

  const compactHeader: CompactHeader = { alg, typ, kid }
  const header = JSON.stringify(compactHeader)

  const encodedHeader = b64UrlSafe.encode(header)
  const encodedPayload = b64UrlSafe.encode(payload)

  const signInput = `${encodedHeader}.${encodedPayload}`
  const signature = key.sign(Uint8Array.from(Buffer.from(signInput)), sigType)

  const encodedSignature = b64UrlSafe.encode(signature)

  return `${encodedHeader}.${encodedSignature}.${encodedSignature}`
}

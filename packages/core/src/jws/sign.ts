import {
  CompactHeader,
  JWSAlgorithm,
  ProtectedHeader,
  Signature,
} from './envelope'
import { b64UrlSafe, SignatureType } from '../utils'
import { Buffer } from 'buffer'
import { JWS } from './parse'

// TODO askar
export class KeySign {
  public createSignature(
    input: Uint8Array,
    signatureType?: SignatureType
  ): Uint8Array {
    // TODO
    return new Uint8Array([1, 2, 3])
  }
}

export const sign = ({
  payload,
  alg,
  signer,
}: {
  payload: Uint8Array
  signer: { kid: string; key: KeySign }
  alg: JWSAlgorithm
}) => {
  const { key, kid } = signer
  // TODO: proper conversion
  const sigType = alg as unknown as SignatureType

  const protectedHeader: ProtectedHeader = {
    alg,
    typ: 'application/didcomm-signed+json',
  }

  const serializedProtected = JSON.stringify(protectedHeader)

  const encodedProtected = b64UrlSafe.encode(serializedProtected)
  const encodedPayload = b64UrlSafe.encode(payload)

  const signInput = `${encodedProtected}.${encodedPayload}`
  const signatureBytes = key.createSignature(
    Uint8Array.from(Buffer.from(signInput)),
    sigType
  )

  const encodedSignature = b64UrlSafe.encode(signatureBytes)

  const signature: Signature = {
    header: { kid },
    protected: encodedProtected,
    signature: encodedSignature,
  }

  const jws = new JWS({
    payload: encodedPayload,
    signatures: [signature],
  })
}

export const signCompact = ({
  typ,
  signer,
  payload,
  alg,
}: {
  payload: Uint8Array
  signer: { kid: string; key: KeySign }
  typ: string
  alg: JWSAlgorithm
}): string => {
  const { key, kid } = signer
  // TODO: proper conversion
  const sigType = alg as unknown as SignatureType

  const compactHeader: CompactHeader = { alg, typ, kid }
  const header = JSON.stringify(compactHeader)

  const encodedHeader = b64UrlSafe.encode(header)
  const encodedPayload = b64UrlSafe.encode(payload)

  const signInput = `${encodedHeader}.${encodedPayload}`
  const signature = key.createSignature(
    Uint8Array.from(Buffer.from(signInput)),
    sigType
  )

  const encodedSignature = b64UrlSafe.encode(signature)

  return `${encodedHeader}.${encodedSignature}.${encodedSignature}`
}

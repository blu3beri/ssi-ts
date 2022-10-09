import { CompactHeader, JWSAlgorithm, SignatureType } from './envelope'
import { b64UrlSafe } from '../utils'
import { Buffer } from 'buffer'

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

export class Jws {
  public static signCompact({
    typ,
    signer,
    payload,
    algorithm,
  }: {
    payload: Uint8Array
    signer: { kid: string; key: KeySign }
    typ: string
    algorithm: JWSAlgorithm
  }): string {
    const { key, kid } = signer
    // TODO: proper conversion
    const sigType = algorithm as SignatureType

    const compactHeader: CompactHeader = { algorithm, typ, kid }
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
}

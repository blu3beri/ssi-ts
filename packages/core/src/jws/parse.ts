import { CompactHeader, ProtectedHeader, Signature } from './envelope'
import { b64UrlSafe } from '../utils'
import { DIDCommError } from '../error'
import { Buffer } from 'buffer'

export class ParsedJWS {
  public jws: JWS
  public protected: Array<ProtectedHeader>

  public constructor(options: { jws: JWS; protected: Array<ProtectedHeader> }) {
    this.jws = options.jws
    this.protected = options.protected
  }
}

export class JWS {
  public signatures: Array<Signature>
  public payload: string

  public constructor(options: {
    signatures: Array<Signature>
    payload: string
  }) {
    this.signatures = options.signatures
    this.payload = options.payload
  }

  public static fromString(s: string): JWS {
    const parsed = JSON.parse(s)
    return new JWS(parsed)
  }

  public parse(): ParsedJWS {
    const protectedHeaders = []
    this.signatures.forEach((s) => {
      const decoded = b64UrlSafe.decode(s.protected)
      const p: ProtectedHeader = JSON.parse(Buffer.from(decoded).toString())
      protectedHeaders.push(p)
    })

    return new ParsedJWS({ jws: this, protected: protectedHeaders })
  }
}

export class ParsedCompactJWS {
  public header: string
  public parsedHeader: CompactHeader
  public payload: string
  public signature: string

  public constructor(options: {
    header: string
    parsedHeader: CompactHeader
    payload: string
    signature: string
  }) {
    this.header = options.header
    this.parsedHeader = options.parsedHeader
    this.payload = options.payload
    this.signature = options.signature
  }

  public static parseCompact(compactJws: string): ParsedCompactJWS {
    const segments = compactJws.split('.')
    if (segments.length !== 3) {
      throw new DIDCommError('unable to parse compactly serialized JWS')
    }

    const header = segments[0]
    const payload = segments[1]
    const signature = segments[2]

    const decoded = b64UrlSafe.decode(header)
    const parsedHeader: CompactHeader = JSON.parse(
      Buffer.from(decoded).toString()
    )

    return new ParsedCompactJWS({ signature, payload, parsedHeader, header })
  }
}

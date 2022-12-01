import type { ProtectedHeader, Signature } from './envelope'

import { Buffer } from 'buffer'

import { b64UrlSafe } from '../utils'

import { ParsedJws } from './ParsedJws'

type JwsProps = {
  signatures: Array<Signature>
  payload: string
}

export class Jws {
  public signatures: Array<Signature>
  public payload: string

  public constructor(options: JwsProps) {
    this.signatures = options.signatures
    this.payload = options.payload
  }

  public static fromString(s: string): Jws {
    const parsed = JSON.parse(s) as JwsProps
    return new Jws(parsed)
  }

  public parse(): ParsedJws {
    const protectedHeaders: Array<ProtectedHeader> = []
    this.signatures.forEach((signature) => {
      const decoded = b64UrlSafe.decode(signature.protected)
      const protectedHeader = JSON.parse(Buffer.from(decoded).toString('utf8')) as ProtectedHeader
      protectedHeaders.push(protectedHeader)
    })

    return new ParsedJws({ jws: this, protected: protectedHeaders })
  }
}

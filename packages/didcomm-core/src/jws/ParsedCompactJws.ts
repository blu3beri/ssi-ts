import type { CompactHeader } from './envelope'

import { Buffer } from 'buffer'

import { DIDCommError } from '../error'
import { b64UrlSafe } from '../utils'

export class ParsedCompactJws {
  public header: string
  public parsedHeader: CompactHeader
  public payload: string
  public signature: string

  public constructor(options: { header: string; parsedHeader: CompactHeader; payload: string; signature: string }) {
    this.header = options.header
    this.parsedHeader = options.parsedHeader
    this.payload = options.payload
    this.signature = options.signature
  }

  public static parseCompact(compactJws: string): ParsedCompactJws {
    const segments = compactJws.split('.')
    if (segments.length !== 3) {
      throw new DIDCommError('unable to parse compactly serialized JWS')
    }

    const header = segments[0]
    const payload = segments[1]
    const signature = segments[2]

    const decoded = b64UrlSafe.decode(header)
    const parsedHeader = JSON.parse(Buffer.from(decoded).toString()) as CompactHeader

    return new ParsedCompactJws({ signature, payload, parsedHeader, header })
  }
}

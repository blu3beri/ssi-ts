import type { ProtectedHeader, Recipient } from './envelope'

import { Buffer } from 'buffer'

import { b64UrlSafe } from '../utils'

import { ParsedJwe } from './ParsedJwe'

type JweProps = {
  protected: string
  recipients: Array<Recipient>
  iv: string
  ciphertext: string
  tag: string
}

export class Jwe {
  public protected: string
  public recipients: Array<Recipient>
  public iv: string
  public ciphertext: string
  public tag: string

  public constructor(options: JweProps) {
    this.protected = options.protected
    this.recipients = options.recipients
    this.iv = options.iv
    this.ciphertext = options.ciphertext
    this.tag = options.tag
  }

  public static fromString(s: string): Jwe {
    const parsed = JSON.parse(s) as JweProps
    return new Jwe(parsed)
  }

  public parse(): ParsedJwe {
    const parsed = b64UrlSafe.decode(this.protected)
    const protectedHeader = JSON.parse(Buffer.from(parsed).toString()) as ProtectedHeader
    const apv = b64UrlSafe.decode(protectedHeader.apv)
    const apu = protectedHeader.apu ? b64UrlSafe.decode(protectedHeader.apu) : undefined

    return new ParsedJwe({ jwe: this, apu, protected: protectedHeader, apv })
  }
}

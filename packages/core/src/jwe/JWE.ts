import { ParsedJWE } from './ParsedJWE'
import { ProtectedHeader, Recipient } from './envelope'
import { b64UrlSafe } from '../utils'
import { Buffer } from 'buffer'

export class Jwe {
  public protected: string
  public recipients: Array<Recipient>
  public iv: string
  public ciphertext: string
  public tag: string

  public constructor(options: {
    protected: string
    recipients: Array<Recipient>
    iv: string
    ciphertext: string
    tag: string
  }) {
    this.protected = options.protected
    this.recipients = options.recipients
    this.iv = options.iv
    this.ciphertext = options.ciphertext
    this.tag = options.tag
  }

  public static fromString(s: string): Jwe {
    const parsed = JSON.parse(s)
    return new Jwe(parsed)
  }

  public parse(): ParsedJWE {
    const parsed = b64UrlSafe.decode(this.protected)
    const protectedHeader: ProtectedHeader = JSON.parse(Buffer.from(parsed).toString())
    const apv = b64UrlSafe.decode(protectedHeader.apv)
    const apu = protectedHeader.apu ? b64UrlSafe.decode(protectedHeader.apu) : undefined

    return new ParsedJWE({ jwe: this, apu, protected: protectedHeader, apv })
  }
}

import { ProtectedHeader, Recipient } from './envelope'
import { b64UrlSafe } from '../utils'
import { Buffer } from 'buffer'
import { DIDCommError } from '../error'

export class ParsedJWE {
  public jwe: JWE
  public protected: ProtectedHeader
  public apv: Uint8Array
  public apu?: Uint8Array

  public constructor(options: {
    jwe: JWE
    protected: ProtectedHeader
    apv: Uint8Array
    apu?: Uint8Array
  }) {
    this.jwe = options.jwe
    this.protected = options.protected
    this.apv = options.apv
    this.apu = options.apu
  }

  public verifyDidComm(): boolean {
    // TODO: verify the sorting
    const kids = this.jwe.recipients.map((r) => r.header.kid).sort()

    const sKids = kids.join('.')

    // Create a sha256 digest of sKids
    const didCommApv = new Uint8Array([1, 2, 3])

    if (this.apv !== didCommApv) throw new DIDCommError('APV Mismatch')

    const didCommApu = Buffer.from(this.apu).toString('UTF-8')

    if (this.protected.skid && didCommApu.length > 0) {
      if (didCommApu !== this.protected.skid) {
        throw new DIDCommError('APU mismatch')
      }
    }

    if (this.protected.skid && didCommApu) {
      throw new DIDCommError('SKID present, but no apu')
    }

    return true
  }
}

export class JWE {
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

  public static fromString(s: string): JWE {
    const parsed = JSON.parse(s)
    return new JWE(parsed)
  }

  public parse(buf: Uint8Array): ParsedJWE {
    const parsed = b64UrlSafe.decode(buf)
    const protectedHeader: ProtectedHeader = JSON.parse(
      Buffer.from(buf).toString()
    )
    const apv = b64UrlSafe.decode(protectedHeader.apv)
    const apu = protectedHeader.apu
      ? b64UrlSafe.decode(protectedHeader.apu)
      : undefined

    return new ParsedJWE({ jwe: this, apu, protected: protectedHeader, apv })
  }
}

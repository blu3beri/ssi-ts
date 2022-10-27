import { DIDCommError } from '../error'
import { ProtectedHeader } from './envelope'
import { JWE } from './JWE'
import { Buffer } from 'buffer'

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

    const didCommApu = this.apu
      ? Buffer.from(this.apu).toString('UTF-8')
      : undefined

    if (this.protected.skid && didCommApu && didCommApu.length > 0) {
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

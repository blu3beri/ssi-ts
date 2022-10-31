import { DIDCommError } from '../error'
import { ProtectedHeader } from './envelope'
import { JWE } from './JWE'
import { Buffer } from 'buffer'
import { assertCryptoProvider, cryptoProvider } from '../providers'

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

  public async verifyDidComm(): Promise<boolean> {
    assertCryptoProvider(['sha256'])

    // TODO: verify the sorting
    const kids = this.jwe.recipients.map((r) => r.header.kid).sort()

    const didCommApv = await cryptoProvider.sha256!.hash(
      Uint8Array.from(Buffer.from(kids.join('.')))
    )

    if (this.apv !== didCommApv) throw new DIDCommError('APV Mismatch')

    const didCommApu = this.apu
      ? Buffer.from(this.apu).toString('utf-8')
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

import type { FromJwk, FromKeyDerivation, JoseKdf, KeyExchange, KeyGen, KeyWrap, ToJwk } from '../crypto'
import type { Jwk } from '../did'
import type { Jwe } from './Jwe'
import type { ProtectedHeader } from './envelope'

import { Buffer } from 'buffer'

import { Sha256 } from '../crypto'
import { DIDCommError } from '../error'
import { assertCryptoProvider } from '../providers'
import { b64UrlSafe } from '../utils'

export class ParsedJwe {
  public jwe: Jwe
  public protected: ProtectedHeader
  public apv: Uint8Array
  public apu?: Uint8Array

  public constructor(options: { jwe: Jwe; protected: ProtectedHeader; apv: Uint8Array; apu?: Uint8Array }) {
    this.jwe = options.jwe
    this.protected = options.protected
    this.apv = options.apv
    this.apu = options.apu
  }

  public async verifyDidComm(): Promise<boolean> {
    assertCryptoProvider(['sha256'])

    const kids = this.jwe.recipients.map((r) => r.header.kid).sort()

    const didCommApv = await Sha256.hash(Uint8Array.from(Buffer.from(kids.join('.'))))

    if (this.apv.length === didCommApv.length && !this.apv.every((e, i) => e === didCommApv[i]))
      throw new DIDCommError('APV Mismatch')

    const didCommApu = this.apu ? Buffer.from(this.apu).toString('utf8') : undefined

    if (this.protected.skid && didCommApu) {
      if (didCommApu !== this.protected.skid) {
        throw new DIDCommError('APU mismatch')
      }
    }

    if (this.protected.skid && didCommApu) {
      throw new DIDCommError('SKID present, but no apu')
    }

    return true
  }

  public decrypt<
    KW extends KeyWrap & FromKeyDerivation,
    KE extends KeyExchange & KeyGen & ToJwk & FromJwk,
    KDF extends JoseKdf
  >({
    sender,
    recipient,
    kdf,
    ke,
    kw,
  }: {
    sender?: { id: string; keyExchange: KE }
    recipient: { id: string; keyExchange: KE }
    kdf: KDF
    ke: { fromJwk(jwk: Jwk): KE }
    kw: KW
  }): Uint8Array {
    const { id: sKid, keyExchange: sKey } = sender ?? {}
    const { id: kid, keyExchange: key } = recipient

    if (sKid ? Buffer.from(sKid) : undefined !== this.apu) throw new DIDCommError('wrong sender key id used')

    const encodedEncryptedKey = this.jwe.recipients.find((r) => r.header.kid === kid)?.encrypted_key

    if (!encodedEncryptedKey) throw new DIDCommError('Recipient not found')

    const encryptedKey = b64UrlSafe.decode(encodedEncryptedKey)

    const epk = ke.fromJwk(this.protected.epk)

    const tag = b64UrlSafe.decode(this.jwe.tag)

    const derivedKey = kdf.deriveKey(
      {
        ephemeralKey: epk,
        senderKey: sKey,
        recipientKey: key,
        alg: Uint8Array.from(Buffer.from(this.protected.alg)),
        apu: this.apu ?? new Uint8Array(0),
        apv: this.apv,
        ccTag: tag,
        receive: true,
      },
      kw
    )

    if (!derivedKey) throw new DIDCommError('Unable to derive key')

    const cek = derivedKey.unwrapKey(encryptedKey)
    if (!cek) throw new DIDCommError('unable to unwrap cek')

    const cipherText = b64UrlSafe.decode(this.jwe.ciphertext)

    const iv = b64UrlSafe.decode(this.jwe.iv)

    const ciphertext = new Uint8Array([...cipherText, ...tag])
    const aad = Uint8Array.from(Buffer.from(this.jwe.protected))

    const plaintext = cek.decrypt({
      ciphertext,
      nonce: iv,
      aad,
    })

    return plaintext
  }
}

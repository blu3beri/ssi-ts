import type { JoseKdf } from '../crypto/JoseKdf'
import type { FromJwk, FromSecretBytes, KeyExchange, ToJwk } from '../crypto/types'
import type { FromKeyDerivation } from '../crypto/types/FromKeyDerivation'
import type { KeyAead } from '../crypto/types/KeyAead'
import type { KeyGen } from '../crypto/types/KeyGen'
import type { KeyWrap } from '../crypto/types/KeyWrap'
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

  public verifyDidComm(): boolean {
    assertCryptoProvider(['sha256'])

    const kids = this.jwe.recipients.map((r) => r.header.kid).sort()

    const didCommApv = Sha256.hash(Uint8Array.from(Buffer.from(kids.join('.'))))

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
    CE extends KeyAead & FromSecretBytes,
    KW extends KeyWrap & FromKeyDerivation,
    KE extends KeyGen & KeyExchange & ToJwk & FromJwk
  >(
    {
      sender,
      recipient,
    }: {
      sender?: { id: string; keyExchange: KE }
      recipient: { id: string; keyExchange: KE }
    },
    ce: typeof KeyAead & typeof FromSecretBytes,
    ke: typeof FromJwk,
    kdf: typeof JoseKdf
  ): Uint8Array {
    const { id: sKid, keyExchange: sKey } = sender ?? {}
    const { id: kid, keyExchange: key } = recipient

    if (sKid ? Buffer.from(sKid) : undefined !== this.apu) throw new DIDCommError('wrong sender key id used')

    const encodedEncryptedKey = this.jwe.recipients.find((r) => r.header.kid === kid)?.encrypted_key

    if (!encodedEncryptedKey) {
      throw new DIDCommError('Recipient not found')
    }

    const encryptedKey = b64UrlSafe.decode(encodedEncryptedKey)

    const epk = ke.fromJwk<KE>(this.protected.epk as Jwk)

    const tag = b64UrlSafe.decode(this.jwe.tag)

    const kw = kdf.deriveKey<KE, KW>({
      ephemeralKey: epk,
      senderKey: sKey,
      recipientKey: key,
      alg: Uint8Array.from(Buffer.from(this.protected.alg)),
      apu: this.apu ?? new Uint8Array(0),
      apv: this.apv,
      ccTag: tag,
      receive: true,
    })

    if (!kw) throw new DIDCommError('Unable to derive kw')

    const cek = kw.unwrapKey(encryptedKey, ce)
    if (!cek) throw new DIDCommError('unable to unwrap cek')

    const cipherText = b64UrlSafe.decode(this.jwe.ciphertext)

    const iv = b64UrlSafe.decode(this.jwe.iv)

    const buf = new Uint8Array([...cipherText, ...tag])

    cek.decrypt(buf, iv, Uint8Array.from(Buffer.from(this.jwe.protected)))

    return buf
  }
}

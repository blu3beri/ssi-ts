import { Buffer } from 'buffer'
import { DIDCommError } from '../error'
import { assertCryptoProvider } from '../providers'
import { b64UrlSafe } from '../utils'
import type { Kdf, P256KeyPair, X25519KeyPair } from '../crypto'
import { Sha256 } from '../crypto'
import type { Jwe } from './JWE'
import type { ProtectedHeader } from './envelope'

export class ParsedJWE {
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

    // TODO: verify the sorting
    const kids = this.jwe.recipients.map((r) => r.header.kid).sort()

    const didCommApv = await Sha256.hash(Uint8Array.from(Buffer.from(kids.join('.'))))

    if (this.apv !== didCommApv) throw new DIDCommError('APV Mismatch')

    const didCommApu = this.apu ? Buffer.from(this.apu).toString('utf-8') : undefined

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

  public async decrypt<
    CE extends {
      decrypt: (options: { buf: Uint8Array; nonce: Uint8Array; aad: Uint8Array }) => Uint8Array
    },
    KW extends { unwrapKey: (key: Uint8Array) => CE },
    KDF extends typeof Kdf,
    KE extends X25519KeyPair | P256KeyPair,
    KES extends typeof X25519KeyPair | typeof P256KeyPair
  >({
    kdf,
    ke,
    sender,
    recipient,
  }: {
    kdf: KDF
    ke: KES
    sender?: { id: string; keyExchange: KE }
    recipient: { id: string; keyExchange: KE }
  }): Promise<Uint8Array> {
    const { id: sKid, keyExchange: sKey } = sender ?? {}
    const { id: kid, keyExchange: key } = recipient

    if (sKid ? Buffer.from(sKid) : undefined !== this.apu) {
      throw new DIDCommError('wrong sender key id used')
    }

    const encodedEncryptedKey = this.jwe.recipients.find((r) => r.header.kid === kid)?.encryptedKey

    if (!encodedEncryptedKey) {
      throw new DIDCommError('Recipient not found')
    }

    const encryptedKey = b64UrlSafe.decode(encodedEncryptedKey)

    const epk = (await ke.fromJwkJson(this.protected.epk)) as KE

    const tag = b64UrlSafe.decode(this.jwe.tag)

    const kw = kdf.deriveKey<KE, KW>({
      ephemeralKey: epk,
      senderKey: sKey,
      recipientKey: key,
      alg: this.protected.alg,
      apu: this.apu ?? new Uint8Array(0),
      apv: this.apv,
      ccTag: tag,
      receive: true,
    })

    if (!kw) {
      throw new DIDCommError('Unable to derive kw')
    }

    const cek: CE = kw.unwrapKey(encryptedKey)
    if (!cek) {
      throw new DIDCommError('unable to unwrap cek')
    }

    const cipherText = b64UrlSafe.decode(this.jwe.ciphertext)

    const iv = b64UrlSafe.decode(this.jwe.iv)

    const buf = new Uint8Array([...cipherText, ...tag])

    const plaintext = cek.decrypt({
      buf,
      nonce: iv,
      aad: Uint8Array.from(Buffer.from(this.jwe.protected)),
    })

    return plaintext
  }
}

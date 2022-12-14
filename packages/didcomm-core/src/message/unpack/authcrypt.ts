/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-explicit-any */
import type { UnpackMetadata } from './UnpackMetadata'
import type { UnpackOptions } from './UnpackOptions'

import { Buffer } from 'buffer'

import { AuthCryptAlgorithm } from '../../algorithms'
import { Ecdh1Pu, JoseKdf, P256KeyPair, X25519KeyPair } from '../../crypto'
import { verificationMethodAsKeypair } from '../../did'
import { DIDCommError } from '../../error'
import { JweEncAlgorithm, Jwe, JweAlgorithm } from '../../jwe'
import { assertDidProvider, assertSecretsProvider, didProvider, secretsProvider } from '../../providers'
import { didOrUrl } from '../../utils'

export const tryUnpackAuthcrypt = async ({
  message,
  options,
  metadata,
}: {
  message: string
  options: UnpackOptions
  metadata: UnpackMetadata
}): Promise<string | undefined> => {
  assertDidProvider(['resolve'])
  assertSecretsProvider(['findSecrets', 'getSecret'])
  const jwe = Jwe.fromString(message)
  if (!jwe) throw new DIDCommError('Invalid JWE message')

  const parsedJwe = jwe.parse()

  if (parsedJwe.protected.alg !== JweAlgorithm.Ecdh1puA256Kw) return undefined
  if (!(await parsedJwe.verifyDidComm())) return undefined
  if (!parsedJwe.apu) throw new DIDCommError('No apu present for authcrypt')

  const fromKid = Buffer.from(parsedJwe.apu).toString('utf8')
  const { did: fromDid, didUrl: fromUrl } = didOrUrl(fromKid)

  if (!fromDid) {
    throw new DIDCommError('Apu does not contain did')
  }

  if (!fromUrl) {
    throw new DIDCommError('Sender key can not be resolved to key agreement')
  }

  const fromDidDoc = await didProvider.resolve!(fromDid)
  if (!fromDidDoc) throw new DIDCommError('Unable to resolve sender did')

  const fromKidDidDoc = fromDidDoc.keyAgreement?.find((k) => k === fromKid)
  if (!fromKidDidDoc) throw new DIDCommError('Sender kid not found in did')

  const fromKeyVerificationMethod = fromDidDoc.verificationMethod?.find((v) => v.id === fromKidDidDoc)
  if (!fromKeyVerificationMethod) {
    throw new DIDCommError('Sender verification method not found in did')
  }

  const fromKey = await verificationMethodAsKeypair(fromKeyVerificationMethod)

  const toKids = parsedJwe.jwe.recipients.map((r) => r.header.kid)
  const toKid = toKids[0]
  if (!toKid) throw new DIDCommError('No recipient keys found')

  const { did: toDid } = didOrUrl(toKid)

  if (!toDid) throw new DIDCommError(`Could not get did from first recipient header kid: ${toKid}`)

  // TODO: not 100% sure if this is the correct implementation
  const unableToResolveAll = toKids.some((k) => {
    const { did: kDid, didUrl: kUrl } = didOrUrl(k)
    return kDid !== toDid || !!kUrl
  })

  if (unableToResolveAll) {
    throw new DIDCommError('Recipient keys are outside of one did or can not be resolved to key agreement')
  }

  if (!metadata.encryptedToKids) {
    metadata.encryptedToKids = toKids
  } else {
    // TODO: Verify that same keys used for authcrypt as for anoncrypt envelope
  }

  metadata.authenticated = true
  metadata.encrypted = true
  metadata.encryptedFromKid = fromKid

  const toKidsFound = await secretsProvider.findSecrets!(toKids)

  if (toKids.length === 0) {
    throw new DIDCommError('No recipient secrets found')
  }

  let payload: Uint8Array | undefined

  for (const toKid of toKidsFound) {
    const toKey = await (await secretsProvider.getSecret!(toKid))?.asKeyPair()
    if (!toKey) {
      throw new DIDCommError('Recipient secret not found after existence checking')
    }

    let _payload: Uint8Array | undefined
    if (
      fromKey instanceof X25519KeyPair &&
      toKey instanceof X25519KeyPair &&
      parsedJwe.protected.enc === JweEncAlgorithm.A256cbcHs512
    ) {
      metadata.encAlgAuth = AuthCryptAlgorithm.A256cbcHs512Ecdh1puA256kw
      _payload = parsedJwe.decrypt({
        sender: { id: fromKid, keyExchange: fromKey },
        recipient: { id: toKid, keyExchange: toKey },
        kdf: Ecdh1Pu<X25519KeyPair>,
        ke: X25519KeyPair,
        kw: {} as any,
      })
    } else if (
      fromKey instanceof P256KeyPair &&
      toKey instanceof P256KeyPair &&
      parsedJwe.protected.enc === JweEncAlgorithm.A256cbcHs512
    ) {
      metadata.encAlgAuth = AuthCryptAlgorithm.A256cbcHs512Ecdh1puA256kw

      _payload = parsedJwe.decrypt({
        sender: { id: fromKid, keyExchange: fromKey },
        recipient: { id: toKid, keyExchange: toKey },
        kdf: Ecdh1Pu<P256KeyPair>,
        ke: P256KeyPair,
        kw: {} as any,
      })
    } else {
      throw new DIDCommError(
        `Incompatible sender and recipient key agreement curves, or unsupported key agreement method. Curves: ${JSON.stringify(
          {
            sender: fromKey,
            recipient: toKey,
            protectedEnc: parsedJwe.protected.enc,
          }
        )}`
      )
    }

    payload = _payload

    if (!options.expectDecryptByAllKeys) break
  }

  if (!payload) {
    throw new DIDCommError('No payload created')
  }

  return Buffer.from(payload).toString('utf8')
}

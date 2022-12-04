/* eslint-disable @typescript-eslint/ban-ts-comment */
import type { UnpackMetadata } from './UnpackMetadata'
import type { UnpackOptions } from './UnpackOptions'

import { Buffer } from 'buffer'

import { AnonCryptAlgorithm } from '../../algorithms'
import { P256KeyPair, X25519KeyPair } from '../../crypto'
import { EcdhEs } from '../../crypto/EcdhEs'
import { DIDCommError } from '../../error'
import { Jwe, JweAlgorithm, JweEncAlgorithm } from '../../jwe'
import { assertSecretsProvider } from '../../providers'
import { Secrets } from '../../secrets'
import { didOrUrl } from '../../utils'

export const tryUnpackAnoncrypt = async ({
  message,
  options,
  metadata,
}: {
  message: string
  options: UnpackOptions
  metadata: UnpackMetadata
}): Promise<undefined | string> => {
  assertSecretsProvider(['getSecret', 'findSecrets'])

  const jwe = Jwe.fromString(message)

  if (!jwe) return undefined

  const parsedJwe = jwe.parse()

  if (parsedJwe.protected.alg !== JweAlgorithm.EcdhEsA256Kw) {
    return undefined
  }

  if (!parsedJwe.verifyDidComm()) {
    throw new DIDCommError('Unable to verify parsed JWE')
  }

  const toKids = parsedJwe.jwe.recipients.map((r) => r.header.kid)
  const toKid = toKids[0]

  if (!toKid) {
    throw new DIDCommError('No recipient keys found')
  }

  const { did: toDid } = didOrUrl(toKid)

  if (!toDid) {
    throw new DIDCommError('Unable to convert toKid to did')
  }

  // TODO: why is this false from e2e test? should this be false?
  const hasKid = !toKids.find((k) => {
    const { did, didUrl } = didOrUrl(k)
    return did !== toDid || !didUrl
  })

  if (!hasKid) {
    throw new DIDCommError('Recipient keys are outside of one did or can not be resolved to key agreement')
  }

  metadata.encryptedToKids = toKids
  metadata.encrypted = true
  metadata.anonymousSender = true

  const toKidsFound = await Secrets.findSecrets(toKids)

  if (toKidsFound.length === 0) {
    throw new DIDCommError('No recipient secrets found')
  }

  let payload: undefined | Uint8Array

  for (const toKid of toKidsFound) {
    const toKey = (await Secrets.getSecret(toKid))?.asKeyPair()

    if (!toKey) {
      throw new DIDCommError('Recipient secret not found after existence checking')
    }

    // TODO: finish this implementation for all the algorithms and keypair types
    if (toKey instanceof X25519KeyPair && parsedJwe.protected.enc === JweEncAlgorithm.A256cbcHs512) {
      payload = parsedJwe.decrypt(
        {
          recipient: { id: toKid, keyExchange: toKey },
        },
        // @ts-ignore
        {},
        X25519KeyPair,
        EcdhEs<X25519KeyPair>
      )
    } else if (toKey instanceof P256KeyPair && parsedJwe.protected.enc === JweEncAlgorithm.A256cbcHs512) {
      metadata.encAlgAnon = AnonCryptAlgorithm.A256cbcHs512EcdhEsA256kw
      payload = parsedJwe.decrypt(
        {
          recipient: { id: toKid, keyExchange: toKey },
        },
        // @ts-ignore
        {},
        P256KeyPair,
        EcdhEs<P256KeyPair>
      )
    } else {
      throw new DIDCommError('Could not find the instance of toKey')
    }

    if (options.expectDecryptByAllKeys) {
      break
    }
  }

  if (!payload) throw new DIDCommError('Could not establish payload')

  const serializedPayload = Buffer.from(payload).toString('utf8')

  return serializedPayload
}

import { DIDCommError } from '../../error'
import { JWE, JWEAlgorithm } from '../../jwe'
import {
  assertCryptoProvider,
  assertSecretsProvider,
  secretsProvider,
} from '../../providers'
import { didOrUrl } from '../../utils'
import { UnpackMetadata } from './UnpackMetadata'
import { UnpackOptions } from './UnpackOptions'
import { Buffer } from 'buffer'
import { Kdf, P256KeyPair, X25519KeyPair } from '../../crypto'

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
  assertCryptoProvider(['p256', 'x25519'])

  const jwe = JWE.fromString(message)

  if (!jwe) return undefined

  const parsedJwe = jwe.parse()

  if (parsedJwe.protected.alg !== JWEAlgorithm.EcdhEsA256Kw) {
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

  if (
    !toKids.find((k) => {
      const { did, didUrl } = didOrUrl(k)
      return did !== toDid || !didUrl
    })
  ) {
    throw new DIDCommError(
      'Recipient keys are outside of one did or can not be resolver to key agreement'
    )
  }

  metadata.encryptedToKids = toKids
  metadata.encrypted = true
  metadata.anonymousSender = true

  const toKidsFound = await secretsProvider.findSecrets!(toKids)

  if (toKidsFound.length === 0) {
    throw new DIDCommError('No recipient secrets found')
  }

  let payload: undefined | Uint8Array

  for (const toKid of toKidsFound) {
    const toKey = (await secretsProvider.getSecret!(toKid))?.asKeyPair()

    if (!toKey) {
      throw new DIDCommError(
        'Recipient secret not found after existence checking'
      )
    }

    // TODO: finish this implementation for all the algorithms and keypair types
    if (toKey instanceof X25519KeyPair) {
      payload = await parsedJwe.decrypt({
        recipient: { id: toKid, keyExchange: toKey },
        ke: X25519KeyPair,
        kdf: Kdf,
      })
    } else if (toKey instanceof P256KeyPair) {
    } else {
      throw new DIDCommError('Could not find the instance of toKey')
    }

    if (options.expectDecryptByAllKeys) {
      break
    }
  }

  if (!payload) throw new DIDCommError('Could not establish payload')

  const serializedPayload = Buffer.from(payload).toString('utf-8')

  return serializedPayload
}

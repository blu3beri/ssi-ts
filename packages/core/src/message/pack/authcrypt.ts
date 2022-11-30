import type { AnonCryptAlgorithm, AuthCryptAlgorithm } from '../../algorithms'

import { KnownKeyAlgorithm } from '../../crypto'
import { DidResolver, verificationMethodToKeyAlg } from '../../did'
import { DIDCommError } from '../../error'
import { assertDidProvider, assertSecretsProvider } from '../../providers'
import { Secrets } from '../../secrets'
import { didOrUrl } from '../../utils'

export const authcrypt = async ({
  to,
  from,
  message,
  encAlgAnon,
  encAlgAuth,
  protectedSender,
}: {
  to: string
  from: string
  message: Uint8Array
  encAlgAuth: AuthCryptAlgorithm
  encAlgAnon: AnonCryptAlgorithm
  protectedSender: boolean
}): Promise<{ message: string; fromKid: string; toKids: Array<string> }> => {
  assertDidProvider(['resolve'])
  assertSecretsProvider(['findSecrets', 'getSecret'])

  const { did: toDid, didUrl: toKid } = didOrUrl(to)
  const { did: fromDid, didUrl: fromKid } = didOrUrl(from)
  if (!toDid) throw new DIDCommError('to is not a did')
  if (!fromDid) throw new DIDCommError('from is not a did')

  const toDidDoc = await DidResolver.resolve(toDid)
  if (!toDidDoc) throw new DIDCommError('Recipient document not found for did')
  // TODO: this can be omitted as they can be embedded
  if (!toDidDoc.verificationMethod) {
    throw new DIDCommError('No verification methods found on the recipient did doc')
  }

  if (!toDidDoc.keyAgreement) {
    throw new DIDCommError('No key agreements found on the recipient did doc')
  }

  const fromDidDoc = await DidResolver.resolve(fromDid)
  if (!fromDidDoc) throw new DIDCommError('Sender document not found for did')
  // TODO: this can be omitted as they can be embedded
  if (!fromDidDoc.verificationMethod) {
    throw new DIDCommError('No verification methods found on the sender did doc')
  }

  if (!fromDidDoc.keyAgreement) {
    throw new DIDCommError('No key agreements found on the sender did doc')
  }

  const fromKids = fromDidDoc.keyAgreement.filter((kid) => (fromKid ? fromKid === kid : true))

  if (fromKids.length === 0) {
    throw new DIDCommError('No sender key agreements found')
  }

  const fromKidsSecrets = await Secrets.findSecrets(fromKids.map((k) => (typeof k === 'string' ? k : k.id)))
  if (fromKidsSecrets.length === 0) {
    throw new DIDCommError('No sender secrets found')
  }

  const fromKeys = fromKidsSecrets.map((kid) => {
    const key = fromDidDoc.verificationMethod?.find((vm) => vm.id === kid)
    if (key) return key
    throw new DIDCommError(`No verification material found for sender key agreement ${kid}`)
  })

  const toKids = toDidDoc.keyAgreement
    .filter((kid) => (toKid ? toKid === kid : true))
    .map((kid) => (typeof kid === 'string' ? kid : kid.id))

  if (toKids.length === 0) {
    throw new DIDCommError('No recipient key agreements found')
  }

  const toKeys = toKids.map((kid) => {
    const key = toDidDoc.verificationMethod?.find((vm) => vm.id === kid)
    if (key) return key
    throw new DIDCommError(`No verification material found for recipient key agreement ${kid}`)
  })

  const fromKey = fromKeys
    .filter((fromKey) => verificationMethodToKeyAlg(fromKey) !== KnownKeyAlgorithm.Unsupported)
    .find(
      (fromKey) => !!toKeys.find((toKey) => verificationMethodToKeyAlg(toKey) === verificationMethodToKeyAlg(fromKey))
    )

  if (!fromKey) {
    throw new DIDCommError('No common keys between sender and recipient found')
  }

  const fromPrivateKey = await Secrets.getSecret(fromKey.id)
  if (!fromPrivateKey) {
    throw new DIDCommError('Unable to resolve sender secret')
  }

  const keyAlg = verificationMethodToKeyAlg(fromKey)

  const toKeysWithSameAlg = toKeys.filter((key) => verificationMethodToKeyAlg(key) === keyAlg)

  // TODO: implement
  const payload = 'TODO'
  // ...

  return { message: payload, fromKid: fromKey.id, toKids: toKeys.map((vm) => vm.id) }
}

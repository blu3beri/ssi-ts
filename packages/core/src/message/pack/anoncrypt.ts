import { AnonCryptAlgorithm } from '../../algorithms'
import { DIDCommError } from '../../error'
import { assertDidProvider, didProvider } from '../../providers'
import { didOrUrl, KnownKeyAlgorithm } from '../../utils'

export const anoncrypt = async ({
  to,
  message,
  encAlgAnon,
}: {
  to: string
  message: Uint8Array
  encAlgAnon: AnonCryptAlgorithm
}): Promise<undefined | { message: string; toKids: Array<string> }> => {
  assertDidProvider(['resolve'])
  const { did: toDid, didUrl: toKid } = didOrUrl(to)
  if (!toDid) throw new DIDCommError('no did in `to` found')

  const toDidDoc = await didProvider.resolve!(toDid)
  if (!toDidDoc) throw new DIDCommError(`No DID Document found for ${toDid}`)
  if (!toDidDoc.keyAgreement) {
    throw new DIDCommError(`No keyAgreement found in ${toDidDoc}`)
  }

  const toKids = toDidDoc.keyAgreement.filter((k) =>
    toKid ? k.id === toKid : true
  )

  if (toKids.length === 0) {
    throw new DIDCommError('No matching key agreements found')
  }

  const toKeys = toKids.map((kid) => {
    const method = toDidDoc.verificationMethod?.find((v) => v.id === kid.id)
    if (!method) {
      throw new DIDCommError('External keys are not supported in this version')
    }
    return method
  })

  // TODO: incorrect filter here
  const keyAlg = toKeys
    .filter((k) => k.type !== KnownKeyAlgorithm.Unsupported.toString())
    .map((k) => k.type)[0]

  if (!keyAlg) throw new DIDCommError('No key agreements found for recipient')

  const tKeys = toKeys.filter((k) => k.type === keyAlg)

  // TODO: create message
  // HERE

  // let to_kids: Vec<_> = to_keys.into_iter().map(|vm| vm.id.clone()).collect();
  // Ok((msg, to_kids))

  const tooooKids = tKeys.map((vm) => vm.id)

  return { message: 'TODO: message', toKids: tooooKids }
}

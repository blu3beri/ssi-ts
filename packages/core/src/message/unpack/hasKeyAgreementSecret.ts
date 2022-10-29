import { DIDResolver } from '../../did'
import { DIDCommError } from '../../error'
import { SecretsResolver } from '../../secrets'
import { didOrUrl } from '../../utils'

export const hasKeyAgreementSecret = async ({
  didOrKid,
  didResolver,
  secretsResolver,
}: {
  didOrKid: string
  didResolver: DIDResolver
  secretsResolver: SecretsResolver
}): Promise<boolean> => {
  const { didUrl: kid, did } = didOrUrl(didOrKid)
  if (!did) throw new DIDCommError('did not found')

  const kids: Array<string> = []
  if (kid) {
    kids.push(kid)
  } else {
    const didDoc = await didResolver.resolve(did)
    if (!didDoc) throw new DIDCommError('Next did doc not found')
    if (!didDoc.keyAgreement) throw new DIDCommError('No key agreements found')
    kids.push(...didDoc.keyAgreement.map((k) => k.id))
  }

  const secretIds = await secretsResolver.findSecrets(kids)

  return secretIds.length > 0
}

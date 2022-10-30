import { DIDCommError } from '../../error'
import {
  assertDidProvider,
  assertSecretsProvider,
  didProvider,
  secretsProvider,
} from '../../providers'
import { didOrUrl } from '../../utils'

export const hasKeyAgreementSecret = async ({
  didOrKid,
}: {
  didOrKid: string
}): Promise<boolean> => {
  assertSecretsProvider(['findSecrets'])
  const { didUrl: kid, did } = didOrUrl(didOrKid)
  if (!did) throw new DIDCommError('did not found')

  const kids: Array<string> = []
  if (kid) {
    kids.push(kid)
  } else {
    assertDidProvider(['resolve'])
    const didDoc = await didProvider.resolve!(did)
    if (!didDoc) throw new DIDCommError('Next did doc not found')
    if (!didDoc.keyAgreement) throw new DIDCommError('No key agreements found')
    kids.push(...didDoc.keyAgreement.map((k) => k.id))
  }

  const secretIds = await secretsProvider.findSecrets!(kids)

  return secretIds.length > 0
}

import type { ServiceEndpoint } from '../../did'

import { DIDCommError } from '../../error'
import { didOrUrl, isDid } from '../../utils'

import { findDidcommService } from './findDidcommService'

export const resolveDidCommServicesChain = async ({
  to,
  serviceId,
}: {
  to: string
  serviceId?: string
}): Promise<Array<{ serviceId: string; service: ServiceEndpoint }>> => {
  const { did } = didOrUrl(to)
  if (!did) throw new DIDCommError('Could not get did from to value')

  const maybeService = await findDidcommService({
    did,
    serviceId,
  })

  if (!maybeService) return []

  const { service } = maybeService

  const services = [maybeService]
  let serviceEndpoint = service.uri

  while (isDid(serviceEndpoint)) {
    if (services.length > 1) {
      throw new DIDCommError('DID doc defines alternative endpoints recursively')
    }

    const s = await findDidcommService({ did: serviceEndpoint })
    if (!s) {
      throw new DIDCommError('Referenced mediator does not provide any correct services')
    }

    services.unshift(s)
    serviceEndpoint = s.service.uri
  }

  return services
}

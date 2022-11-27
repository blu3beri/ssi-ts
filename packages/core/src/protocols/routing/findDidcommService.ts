import type { ServiceEndpoint } from '../../did'
import { DidResolver } from '../../did'
import { DIDCommError } from '../../error'
import { assertDidProvider } from '../../providers'
import { DIDCOMM_V2_PROFILE } from './constants'

export const findDidcommService = async ({
  did,
  serviceId,
}: {
  did: string
  serviceId?: string
}): Promise<{ serviceId: string; service: ServiceEndpoint } | undefined> => {
  assertDidProvider(['resolve'])

  const didDoc = await DidResolver.resolve!(did)
  if (!didDoc) throw new DIDCommError('DID not found')
  if (!didDoc.service) {
    throw new DIDCommError('Service field not found on DIDDoc')
  }

  if (serviceId) {
    const service = didDoc.service.find((s) => s.id === serviceId)
    if (!service) {
      throw new DIDCommError(`Service with specified ID ${serviceId} not found`)
    }

    if (service.serviceEndpoint) {
      const serviceEndpoint = service.serviceEndpoint
      if (serviceEndpoint.accept) {
        if (serviceEndpoint.accept?.length === 0 || serviceEndpoint.accept?.includes(DIDCOMM_V2_PROFILE)) {
          return { serviceId, service: serviceEndpoint }
        } else {
          throw new DIDCommError('Service with specified ID does not accept didcomm/v2 profile')
        }
      } else {
        return { serviceId, service: serviceEndpoint }
      }
    } else {
      throw new DIDCommError('Service with specified ID is not of correct type ')
    }
  } else {
    didDoc.service.find((service) => {
      if (service.serviceEndpoint) {
        const serviceEndpoint = service.serviceEndpoint
        if (serviceEndpoint.accept) {
          if (serviceEndpoint.accept.length === 0 || serviceEndpoint.accept.includes(DIDCOMM_V2_PROFILE)) {
            return { sevice: serviceEndpoint, serviceId: service.id }
          }
        } else {
          return undefined
        }
      } else {
        return undefined
      }
    })
  }
}

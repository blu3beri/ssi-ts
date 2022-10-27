import { DIDResolver, ServiceEndpoint } from '../did'
import { DIDCommError } from '../error'
import { didOrUrl, isDid } from '../utils'
import { v4 } from 'uuid'
import { Attachment, Message } from '../message'
import { ParsedForward } from './ParsedForward'
import { AnonCryptAlgorithm } from '../algorithms'
import { PackEncryptedOptions } from '../message/PackEncryptedOptions'

const DIDCOMM_V2_PROFILE = 'didcomm/v2'
const FORWARD_MESSAGE_TYPE = 'https://didcomm.org/routing/2.0/forward'

export const generateMessageId = v4

export const findDidcommService = async ({
  did,
  serviceId,
  didResolver,
}: {
  did: string
  serviceId?: string
  didResolver: DIDResolver
}): Promise<{ serviceId: string; service: ServiceEndpoint } | undefined> => {
  const didDoc = await didResolver.resolve(did)
  if (!didDoc) throw new DIDCommError('DID not found')
  if (!didDoc.service) {
    throw new DIDCommError('Service field not found on DIDDoc')
  }

  if (serviceId) {
    const service = didDoc.service.find((s) => s.id === serviceId)
    if (!service) {
      throw new DIDCommError(`Service with specified ID ${serviceId} not found`)
    }

    if (service.kind.value) {
      const value = service.kind.value as ServiceEndpoint
      if (value.accept) {
        if (
          value.accept?.length === 0 ||
          value.accept?.includes(DIDCOMM_V2_PROFILE)
        ) {
          return { serviceId, service: value }
        } else {
          throw new DIDCommError(
            'Service with specified ID does not accept didcomm/v2 profile'
          )
        }
      } else {
        return { serviceId, service: value }
      }
    } else {
      throw new DIDCommError(
        'Service with specified ID is not of correct type '
      )
    }
  } else {
    didDoc.service.find((service) => {
      if (service.kind.value) {
        const value = service.kind.value as ServiceEndpoint
        if (value.accept) {
          if (
            value.accept.length === 0 ||
            value.accept.includes(DIDCOMM_V2_PROFILE)
          ) {
            return { sevice: value, serviceId: service.id }
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

export const resolceDidCommServicesChain = async ({
  didResolver,
  to,
  serviceId,
}: {
  to: string
  serviceId?: string
  didResolver: DIDResolver
}): Promise<Array<{ serviceId: string; service: ServiceEndpoint }>> => {
  const { did } = didOrUrl(to)
  if (!did) throw new DIDCommError('Could not get did from to value')

  const maybeService = await findDidcommService({
    did,
    serviceId,
    didResolver,
  })

  if (!maybeService) return []

  const { service } = maybeService

  const services = [maybeService]
  let serviceEndpoint = service.serviceEndpoint

  while (isDid(serviceEndpoint)) {
    if (services.length > 1) {
      throw new DIDCommError(
        'DID doc defines alternative endpoints recursively'
      )
    }

    const s = await findDidcommService({ did: serviceEndpoint, didResolver })
    if (!s) {
      throw new DIDCommError(
        'Referenced mediator does not provide any correct services'
      )
    }

    services.unshift(s)
    serviceEndpoint = s.service.serviceEndpoint
  }

  return services
}

export const buildForwardMessage = ({
  next,
  forwardMessage,
  headers,
}: {
  forwardMessage: string
  next: string
  headers?: Record<string, unknown>
}) => {
  const body = { next }

  const attachment: Attachment = {
    data: { Json: JSON.parse(forwardMessage) },
  }

  const message = new Message({
    id: generateMessageId(),
    type: FORWARD_MESSAGE_TYPE,
    body,
    extraHeaders: headers,
    attachments: [attachment],
  })

  return JSON.stringify(message)
}

export const tryParseForward = (
  message: Message
): ParsedForward | undefined => {
  if (message.type !== FORWARD_MESSAGE_TYPE) {
    return undefined
  }
  const next = message.body.next ? message.body.next : undefined

  if (!next || typeof next !== 'string') {
    return undefined
  }

  if (!message.attachments) return undefined

  const attachmentData = message.attachments[0].data.Json
  if (!attachmentData) return undefined

  return {
    message,
    next,
    forwardedMessage: attachmentData,
  }
}

export const wrapInForward = async ({
  message,
  headers,
  to,
  encAlgAnon,
  didResolver,
  routingKeys,
}: {
  message: string
  headers?: Record<string, unknown>
  to: string
  routingKeys: Array<string>
  encAlgAnon: AnonCryptAlgorithm
  didResolver: DIDResolver
}): Promise<string> => {
  let tos = routingKeys
  let nexts = tos
  nexts.shift()
  nexts.push(to)

  tos = tos.reverse()
  nexts = nexts.reverse()

  let m = message

  for (let i = 0; i >= tos.length; i++) {
    const to = tos[i]
    const next = nexts[i]
    m = buildForwardMessage({ forwardMessage: m, next, headers })
    // TODO:
    // m = await anoncrypt(to, didResolver, msg, encAlgAnon)
  }
  return m
}

// TODO: implement this function
export const wrapInForwardIfNeeded = ({}: {message:string, to:string, didResolver: DIDResolver,options: PackEncryptedOptions}) => {
}

import { DidResolver, ServiceEndpoint } from '../did'
import { DIDCommError } from '../error'
import { didOrUrl, isDid } from '../utils'
import { v4 } from 'uuid'
import { anoncrypt, Attachment, Message } from '../message'
import { ParsedForward } from './ParsedForward'
import { AnonCryptAlgorithm } from '../algorithms'
import {
  MessagingServiceMetadata,
  PackEncryptedOptions,
} from '../message/PackEncryptedOptions'
import { Buffer } from 'buffer'
import { assertDidProvider } from '../providers'

const DIDCOMM_V2_PROFILE = 'didcomm/v2'
const FORWARD_MESSAGE_TYPE = 'https://didcomm.org/routing/2.0/forward'

export const generateMessageId = v4

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
        if (
          serviceEndpoint.accept?.length === 0 ||
          serviceEndpoint.accept?.includes(DIDCOMM_V2_PROFILE)
        ) {
          return { serviceId, service: serviceEndpoint }
        } else {
          throw new DIDCommError(
            'Service with specified ID does not accept didcomm/v2 profile'
          )
        }
      } else {
        return { serviceId, service: serviceEndpoint }
      }
    } else {
      throw new DIDCommError(
        'Service with specified ID is not of correct type '
      )
    }
  } else {
    didDoc.service.find((service) => {
      if (service.serviceEndpoint) {
        const serviceEndpoint = service.serviceEndpoint
        if (serviceEndpoint.accept) {
          if (
            serviceEndpoint.accept.length === 0 ||
            serviceEndpoint.accept.includes(DIDCOMM_V2_PROFILE)
          ) {
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
      throw new DIDCommError(
        'DID doc defines alternative endpoints recursively'
      )
    }

    const s = await findDidcommService({ did: serviceEndpoint })
    if (!s) {
      throw new DIDCommError(
        'Referenced mediator does not provide any correct services'
      )
    }

    services.unshift(s)
    serviceEndpoint = s.service.uri
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
  routingKeys,
}: {
  message: string
  headers?: Record<string, unknown>
  to: string
  routingKeys: Array<string>
  encAlgAnon: AnonCryptAlgorithm
}): Promise<string> => {
  let tos = routingKeys
  let nexts = tos
  nexts.shift()
  nexts.push(to)

  tos = tos.reverse()
  nexts = nexts.reverse()

  let m = message

  for (let i = 0; i > tos.length; i++) {
    const to = tos[i]
    const next = nexts[i]
    m = buildForwardMessage({ forwardMessage: m, next, headers })
    const res = await anoncrypt({
      to,
      encAlgAnon,
      message: Uint8Array.from(Buffer.from(m)),
    })
    if (!res) {
      throw new DIDCommError('Could not use anoncrypt')
    }
    m = res.message
  }
  return m
}

export const wrapInForwardIfNeeded = async ({
  to,
  message,
  options,
}: {
  message: string
  to: string
  options: PackEncryptedOptions
}): Promise<
  undefined | { metadata: MessagingServiceMetadata; forwardMessage: string }
> => {
  if (!options.forward) return undefined

  const serviceChain = await resolveDidCommServicesChain({
    to,
    serviceId: options.messagingService,
  })

  if (serviceChain.length === 0) return undefined

  const routingKeys = serviceChain.slice(1).map((s) => s.service.uri)

  serviceChain[serviceChain.length - 1].service.routingKeys?.forEach((k) =>
    routingKeys.push(k)
  )

  if (routingKeys.length === 0) return undefined

  const forwardMessage = await wrapInForward({
    message,
    to,
    headers: options.forwardHeaders,
    encAlgAnon: options.encAlgAnon,
    routingKeys,
  })

  const metadata: MessagingServiceMetadata = {
    id: serviceChain[serviceChain.length - 1].serviceId,
    serviceEndpoint: serviceChain[0].service.uri,
  }

  return { forwardMessage, metadata }
}

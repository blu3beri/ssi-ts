import type { MessagingServiceMetadata, PackEncryptedOptions } from '../../message/PackEncryptedOptions'
import { resolveDidCommServicesChain } from './resolveDidcommServicesChain'
import { wrapInForward } from './wrapInForward'

export const wrapInForwardIfNeeded = async ({
  to,
  message,
  options,
}: {
  message: string
  to: string
  options: PackEncryptedOptions
}): Promise<undefined | { metadata: MessagingServiceMetadata; forwardMessage: string }> => {
  if (!options.forward) return undefined

  const serviceChain = await resolveDidCommServicesChain({
    to,
    serviceId: options.messagingService,
  })

  if (serviceChain.length === 0) return undefined

  const routingKeys = serviceChain.slice(1).map((s) => s.service.uri)

  serviceChain[serviceChain.length - 1].service.routingKeys?.forEach((k) => routingKeys.push(k))

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

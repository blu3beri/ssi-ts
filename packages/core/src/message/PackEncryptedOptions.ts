import { AnonCryptAlgorithm, AuthCryptAlgorithm } from "../algorithms"

export type PackEncryptedOptions = {
  protectSender: boolean
  forward: boolean
  forwardHeaders?: Record<string, unknown>
  messagingService?: string
  encAlgAuth: AuthCryptAlgorithm
  encAlgAnon: AnonCryptAlgorithm
}

export type MessagingServiceMetadata = {
  id: string
  serviceEndpoint: string
}

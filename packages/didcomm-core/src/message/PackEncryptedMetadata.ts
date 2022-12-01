import type { MessagingServiceMetadata } from './PackEncryptedOptions'

export type PackEncryptedMetadata = {
  messagingService?: MessagingServiceMetadata
  toKids: Array<string>
  fromKid?: string
  signByKid?: string
}

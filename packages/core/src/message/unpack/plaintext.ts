import { DIDResolver } from '../../did'
import { Message } from '../Message'
import { UnpackMetadata } from './UnpackMetadata'

export const tryUnpackPlaintext = async ({}: {
  message: string
  didResolver: DIDResolver
  metadata: UnpackMetadata
}): Promise<Message | undefined> => {
  return undefined
}

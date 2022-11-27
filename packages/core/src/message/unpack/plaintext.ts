import { assertDidProvider } from '../../providers'
import { Message } from '../Message'
import { UnpackMetadata } from './UnpackMetadata'

export const tryUnpackPlaintext = async ({
  message,
  metadata,
}: {
  message: string
  metadata: UnpackMetadata
}): Promise<Message | undefined> => {
  assertDidProvider(['resolve'])

  return undefined
}

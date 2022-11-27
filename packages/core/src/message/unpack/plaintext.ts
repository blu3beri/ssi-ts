import { assertDidProvider } from '../../providers'
import type { Message } from '../Message'
import type { UnpackMetadata } from './UnpackMetadata'

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

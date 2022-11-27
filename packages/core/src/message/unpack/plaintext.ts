import type { Message } from '../Message'
import type { UnpackMetadata } from './UnpackMetadata'

import { assertDidProvider } from '../../providers'

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

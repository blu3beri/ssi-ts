import { UnpackMetadata } from './UnpackMetadata'
import { UnpackOptions } from './UnpackOptions'

export const tryUnpackAnoncrypt = async ({}: {
  message: string
  options: UnpackOptions
  metadata: UnpackMetadata
}): Promise<undefined | string> => {
  return 'TODO'
}

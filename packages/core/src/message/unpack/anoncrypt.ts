import { SecretsResolver } from '../../secrets'
import { UnpackMetadata } from './UnpackMetadata'
import { UnpackOptions } from './UnpackOptions'

export const tryUnpackAnoncrypt = async ({}: {
  message: string
  secretsResolver: SecretsResolver
  options: UnpackOptions
  metadata: UnpackMetadata
}): Promise<undefined | string> => {
  return 'TODO'
}

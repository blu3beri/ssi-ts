import { DIDResolver } from '../../did'
import { SecretsResolver } from '../../secrets'
import { UnpackMetadata } from './UnpackMetadata'
import { UnpackOptions } from './UnpackOptions'

export const tryUnpackAuthcrypt = async ({}: {
  message: string
  didResolver: DIDResolver
  secretsResolver: SecretsResolver
  options: UnpackOptions
  metadata: UnpackMetadata
}): Promise<string> => {
  return 'TODO'
}

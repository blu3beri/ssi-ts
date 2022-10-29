import { DIDResolver } from '../../did'
import { UnpackMetadata } from './UnpackMetadata'

export const tryUnpackSign = async ({}: {
  message: string
  didResolver: DIDResolver
  metadata: UnpackMetadata
}): Promise<string> => {
  return 'TODO'
}

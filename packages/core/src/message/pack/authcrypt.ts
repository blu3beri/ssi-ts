import { AnonCryptAlgorithm, AuthCryptAlgorithm } from '../algorithms'
import { DIDResolver } from '../did'
import { SecretsResolver } from '../secrets'

// TODO: implementation
export const authcrypt = async ({
  to,
  from,
  didResolver,
  secrectsResolver,
  message,
  encAlgAnon,
  encAlgAuth,
  protectedSender,
}: {
  to: string
  from: string
  didResolver: DIDResolver
  secrectsResolver: SecretsResolver
  message: Uint8Array
  encAlgAuth: AuthCryptAlgorithm
  encAlgAnon: AnonCryptAlgorithm
  protectedSender: boolean
}): Promise<{ message: string; fromKid: string; toKids: Array<string> }> => {
  return { message: 'TODO', fromKid: 'TODO', toKids: [] }
}

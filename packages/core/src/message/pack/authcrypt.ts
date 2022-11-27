import type { AnonCryptAlgorithm, AuthCryptAlgorithm } from '../../algorithms'

// TODO: implementation
export const authcrypt = async ({
  to,
  from,
  message,
  encAlgAnon,
  encAlgAuth,
  protectedSender,
}: {
  to: string
  from: string
  message: Uint8Array
  encAlgAuth: AuthCryptAlgorithm
  encAlgAnon: AnonCryptAlgorithm
  protectedSender: boolean
}): Promise<{ message: string; fromKid: string; toKids: Array<string> }> => {
  return Promise.resolve({ message: 'TODO', fromKid: 'TODO', toKids: [] })
}

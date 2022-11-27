import { DIDCommError } from '../../error'

export const assertProvider = <T>(fields: Array<keyof T>, provider?: T) => {
  const isValid = provider && fields.every((f) => provider[f])
  if (!isValid) {
    throw new DIDCommError(`No functionality found for ${fields} on provider`)
  }
}

import { DIDCommError } from '../../error'

export const assertProvider = <T>(fields: Array<keyof T>, provider: T) => {
  if (!fields.every((f) => provider[f])) {
    throw new DIDCommError(`No functionality found for ${fields.toString()} on provider`)
  }
}

import { DIDCommError } from '../../error'

export class KeyGen {
  public static generate(): KeyGen {
    throw new DIDCommError('generate not implemented on super class')
  }
}

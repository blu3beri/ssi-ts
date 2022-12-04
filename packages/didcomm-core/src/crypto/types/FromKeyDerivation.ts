import type { KeyDerivation } from './KeyDerivation'

import { DIDCommError } from '../../error'

export abstract class FromKeyDerivation {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public static fromKeyDerivation<D extends KeyDerivation>(_derive: D): FromKeyDerivation {
    throw new DIDCommError('fromKeyDerivation is not implemented on super class')
  }
}

import type { ToJwk } from './ToJwk'

import { DIDCommError } from '../../error'

export abstract class FromJwk {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public static fromJwk<K extends FromJwk>(_jwk: ToJwk): K {
    throw new DIDCommError('fromJwk not implemented by super class')
  }
}

import type { VerificationMethod } from '../DidDocument'

import { KnownKeyAlgorithm } from '../../crypto'

// TODO: implement
export const verificationMethodToKeyAlg = (verificationMethod: VerificationMethod): KnownKeyAlgorithm => {
  return KnownKeyAlgorithm.K256
}

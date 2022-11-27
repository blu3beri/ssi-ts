import { AnonCryptAlgorithm, AuthCryptAlgorithm, SigningAlgorithm } from '../../algorithms'
import { FromPrior } from '../fromPrior'

export type UnpackMetadata = {
  encrypted: boolean
  authenticated: boolean
  nonRepudiation: boolean
  anonymousSender: boolean
  reWrappedInForward: boolean
  encryptedFromKid?: string
  encryptedToKids?: Array<string>
  signFrom?: string
  fromPriorIssuerKid?: string
  encAlgAuth?: AuthCryptAlgorithm
  encAlgAnon?: AnonCryptAlgorithm
  signAlg?: SigningAlgorithm
  signedMessage?: string
  fromPrior?: FromPrior
}

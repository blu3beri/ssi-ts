import type { CryptoProvider } from '@ssi-ts/didcomm-core'

import { sha256 } from './sha256'
import { x25519 } from './x25519'

export const cryptoProvider: CryptoProvider = {
  sha256,
  x25519,
}

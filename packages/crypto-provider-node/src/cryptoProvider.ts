import type { CryptoProvider } from '@didcomm-ts/core'

import { sha256 } from './sha256'

export const cryptoProvider: CryptoProvider = {
  sha256,
}

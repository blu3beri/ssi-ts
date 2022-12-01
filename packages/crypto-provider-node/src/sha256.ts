import Crypto from 'crypto'

export const sha256 = {
  hash: (input: Uint8Array) => Crypto.createHash('sha256').update(input).digest(),
}

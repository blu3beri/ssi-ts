import type { SignatureType } from '../../utils'

export abstract class KeySign {
  public abstract sign(message: Uint8Array, signatureType?: SignatureType): Uint8Array
}

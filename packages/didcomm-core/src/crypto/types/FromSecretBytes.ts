import { DIDCommError } from '../../error'

export class FromSecretBytes {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public static fromSecretBytes(_: Uint8Array): FromSecretBytes {
    throw new DIDCommError('fromSecretBytes not implemented on super class')
  }
}

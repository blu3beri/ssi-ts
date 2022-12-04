import { DIDCommError } from '../../error'

export class FromPublicBytes {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public static fromPublicBytes(_: Uint8Array): FromPublicBytes {
    throw new DIDCommError('frompublicBytes not implemented on super class')
  }
}

import { DIDDocument } from '../../did/DidDocument'

export type DidProvider = {
  resolve?: (did: string) => Promise<DIDDocument | undefined>
}

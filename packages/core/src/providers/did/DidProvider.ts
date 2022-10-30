import { DIDDocument } from '../../did/DIDDocument'

export type DidProvider = {
  resolve?: (did: string) => Promise<DIDDocument | undefined>
}

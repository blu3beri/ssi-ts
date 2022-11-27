import { DidDocument } from '../../did/DidDocument'

export type DidProvider = {
  resolve?: (did: string) => Promise<DidDocument | undefined>
}

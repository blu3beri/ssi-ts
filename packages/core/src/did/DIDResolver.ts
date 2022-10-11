import { DIDDocument } from './DIDDocument'

export interface DIDResolver {
  resolve(did: string): Promise<DIDDocument>
}

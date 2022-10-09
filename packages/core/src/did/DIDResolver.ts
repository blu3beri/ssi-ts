import { DIDDoc } from './DIDDoc'

// TODO: Result<Option<DIDDoc>>
export interface DIDResolver {
  resolve(did: string): Promise<DIDDoc | undefined>
}

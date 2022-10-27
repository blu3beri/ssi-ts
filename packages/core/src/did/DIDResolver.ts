import { DIDDocument } from './DIDDocument'

export interface DIDResolver {
  resolve(
    did: string,
    resolutionOptions?: Record<never, never>
  ): Promise<DIDDocument>
}

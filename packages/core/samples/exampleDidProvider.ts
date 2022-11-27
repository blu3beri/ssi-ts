import type { DIDDocument } from '../src/did'
import type { DidProvider } from '../src/providers'

export const createDidProvider = (dids: Array<DIDDocument>): DidProvider => ({
  resolve: async (did: string): Promise<DIDDocument | undefined> => Promise.resolve(dids.find((d) => d.id === did)),
})

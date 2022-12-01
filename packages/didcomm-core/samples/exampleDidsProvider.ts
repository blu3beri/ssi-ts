import type { DidDocument } from '../src/did'
import type { DidProvider } from '../src/providers'

export const createExampleDidsProvider = (dids: Array<DidDocument>): DidProvider => ({
  resolve: async (did: string): Promise<DidDocument | undefined> => Promise.resolve(dids.find((d) => d.id === did)),
})

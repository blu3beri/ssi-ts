import type { DIDDocument } from '../src/did'
import type { DidProvider } from '../src/providers'

const exampleDids: Record<string, DIDDocument> = {
  'did:example:1': { id: 'did:example:1' },
}

const resolve = async (did: string): Promise<DIDDocument | undefined> => {
  return exampleDids[did]
}

export const exampleDidProvider: DidProvider = {
  resolve,
}

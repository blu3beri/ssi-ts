import type { DidDocument } from './DidDocument'

import { assertDidProvider, didProvider } from '../providers'

export class DidResolver {
  public static async resolve(did: string): Promise<DidDocument | undefined> {
    assertDidProvider(['resolve'])
    return didProvider.resolve!(did)
  }
}

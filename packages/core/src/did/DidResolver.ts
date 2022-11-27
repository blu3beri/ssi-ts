import { assertDidProvider, didProvider } from '../providers'
import type { DidDocument } from './DidDocument'

export class DidResolver {
  public static async resolve(did: string): Promise<DidDocument | undefined> {
    assertDidProvider(['resolve'])
    return didProvider.resolve!(did)
  }
}

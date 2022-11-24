import { assertDidProvider, didProvider } from '../providers'
import { DIDDocument } from './DidDocument'

export class DidResolver {
  public static async resolve(did: string): Promise<DIDDocument | undefined> {
    assertDidProvider(['resolve'])
    return didProvider.resolve!(did)
  }
}

import { ProtectedHeader } from "./envelope"
import { JWS } from "./JWS"

export class ParsedJWS {
  public jws: JWS
  public protected: Array<ProtectedHeader>

  public constructor(options: { jws: JWS; protected: Array<ProtectedHeader> }) {
    this.jws = options.jws
    this.protected = options.protected
  }
}

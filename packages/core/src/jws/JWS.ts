import { b64UrlSafe } from "../utils"
import { ProtectedHeader, Signature } from "./envelope"
import { ParsedJWS } from "./ParsedJWS"
import { Buffer } from "buffer"

export class JWS {
  public signatures: Array<Signature>
  public payload: string

  public constructor(options: { signatures: Array<Signature>; payload: string }) {
    this.signatures = options.signatures
    this.payload = options.payload
  }

  public static fromString(s: string): JWS {
    const parsed = JSON.parse(s)
    return new JWS(parsed)
  }

  public parse(): ParsedJWS {
    const protectedHeaders: Array<ProtectedHeader> = []
    this.signatures.forEach((s) => {
      const decoded = b64UrlSafe.decode(s.protected)
      const p: ProtectedHeader = JSON.parse(Buffer.from(decoded).toString())
      protectedHeaders.push(p)
    })

    return new ParsedJWS({ jws: this, protected: protectedHeaders })
  }
}

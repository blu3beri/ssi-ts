import type { Jws } from './Jws'
import type { ProtectedHeader } from './envelope'

export class ParsedJws {
  public jws: Jws
  public protected: Array<ProtectedHeader>

  public constructor(options: { jws: Jws; protected: Array<ProtectedHeader> }) {
    this.jws = options.jws
    this.protected = options.protected
  }
}

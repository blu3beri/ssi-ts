import base58 from 'bs58'
import { Buffer } from 'buffer'

export class b58 {
  public static encode(b: Uint8Array): string {
    return base58.encode(b)
  }

  public static decode(s: string): Uint8Array {
    return base58.decode(s)
  }
}

export class b64 {
  public static encode(b: Uint8Array): string {
    return Buffer.from(b).toString('base64')
  }

  public static decode(s: string): Uint8Array {
    return Buffer.from(s, 'base64')
  }
}

export class b64UrlSafe {
  public static encode(b: Uint8Array | string): string {
    const buf = typeof b === 'string' ? Buffer.from(b, 'utf8') : Buffer.from(b)
    return buf.toString('base64url')
  }

  public static decode(s: string | Uint8Array): Uint8Array {
    const y = s instanceof Uint8Array ? s.toString() : s
    return Buffer.from(y, 'base64url')
  }
}

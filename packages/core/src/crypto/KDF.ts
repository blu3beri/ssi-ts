import { JweAlgorithm } from "../jwe"

export class Kdf {
  static deriveKey<KE, KW>(options: {
    ephemeralKey: KE
    senderKey?: KE
    recipientKey: KE
    alg: JweAlgorithm
    apu: Uint8Array
    apv: Uint8Array
    ccTag: Uint8Array
    receive: boolean
  }): KW {
    return "TODO" as KW
  }
}

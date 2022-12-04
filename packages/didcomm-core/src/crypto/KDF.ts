export class Kdf {
  public static deriveKey<KE, KW, TODO>(options: {
    ephemeralKey: KE
    senderKey?: KE
    recipientKey: KE
    alg: Uint8Array
    apu: Uint8Array
    apv: Uint8Array
    ccTag: Uint8Array
    receive: boolean
  }): KW {
    return {
      unwrapKey: (key: Uint8Array) =>
        ({
          decrypt: (options: { buf: Uint8Array; nonce: Uint8Array; aad: Uint8Array }) => new Uint8Array([0]),
        } as unknown as TODO),
    } as KW
  }
}

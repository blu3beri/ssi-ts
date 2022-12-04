export class KeyPair {
  public publicKey: Uint8Array
  public privateKey?: Uint8Array

  public constructor({ publicKey, privateKey }: { publicKey: Uint8Array; privateKey?: Uint8Array }) {
    this.publicKey = publicKey
    this.privateKey = privateKey
  }
}

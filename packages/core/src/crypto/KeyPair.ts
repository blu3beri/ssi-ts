export abstract class KeyPair {
  public abstract type: string

  private publicKey: Uint8Array
  private privateKey?: Uint8Array

  public constructor({
    publicKey,
    privateKey,
  }: {
    publicKey: Uint8Array
    privateKey?: Uint8Array
  }) {
    this.publicKey = publicKey
    this.privateKey = privateKey
  }

  public abstract sign(message: Uint8Array): Promise<Uint8Array>
}

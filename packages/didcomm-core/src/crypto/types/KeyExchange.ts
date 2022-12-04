export abstract class KeyExchange {
  public abstract writeKeyExchange(other: KeyExchange): Uint8Array

  // TODO: we can remove this later
  public keyExchangeBytes(other: KeyExchange): Uint8Array {
    return this.writeKeyExchange(other)
  }
}

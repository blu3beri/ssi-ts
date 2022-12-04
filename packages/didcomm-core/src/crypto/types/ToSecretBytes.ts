export abstract class ToSecretBytes {
  public abstract secretBytesLength(): number

  public abstract writeSecretBytes(out: Uint8Array): void

  public toSecretBytes(): Uint8Array {
    const buf = new Uint8Array(128)
    this.writeSecretBytes(buf)
    return buf
  }
}

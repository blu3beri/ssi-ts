import { DIDCommError } from '../error'

// TODO: these need to map to a string
export enum KnownKeyAlgorithm {
  Ed25519,
  X25519,
  P256,
  K256,
  Unsupported,
}

// TODO: askar_crypto::alg::k256keypair...
// generation, etc. must be supplied by the user
export class P256KeyPair {
  private publicKey: string
  private secretKey: string

  public constructor({
    publicKey,
    secretKey,
  }: {
    publicKey: string
    secretKey: string
  }) {
    this.publicKey = publicKey
    this.secretKey = secretKey
  }

  static fromJwkJson(json: Record<string, unknown>) {
    return new P256KeyPair({ secretKey: 'TODO', publicKey: 'TODO' })
  }
}

export class K256KeyPair {
  private publicKey: string
  private secretKey: string

  public constructor({
    publicKey,
    secretKey,
  }: {
    publicKey: string
    secretKey: string
  }) {
    this.publicKey = publicKey
    this.secretKey = secretKey
  }

  static fromJwkJson(json: Record<string, unknown>) {
    return new K256KeyPair({ secretKey: 'TODO', publicKey: 'TODO' })
  }
}

export class Ed25519KeyPair {
  private publicKey: string
  private secretKey: string

  public constructor({
    publicKey,
    secretKey,
  }: {
    publicKey: string
    secretKey: string
  }) {
    this.publicKey = publicKey
    this.secretKey = secretKey
  }

  static fromJwkJson(json: Record<string, unknown>) {
    return new Ed25519KeyPair({ secretKey: 'TODO', publicKey: 'TODO' })
  }

  static fromSecretBytes(bytes: Uint8Array) {
    return new X25519KeyPair({
      publicKey: new Uint8Array([]),
      secretKey: bytes,
    })
  }
}

export class X25519KeyPair {
  private publicKey: Uint8Array
  private secretKey?: Uint8Array

  public constructor({
    publicKey,
    secretKey,
  }: {
    publicKey: Uint8Array
    secretKey?: Uint8Array
  }) {
    this.publicKey = publicKey
    this.secretKey = secretKey
  }

  public static fromJwkJson(json: Record<string, unknown>) {
    return new X25519KeyPair({
      publicKey: new Uint8Array([]),
      secretKey: new Uint8Array([]),
    })
  }

  public static fromSecretBytes(bytes: Uint8Array) {
    return new X25519KeyPair({
      publicKey: new Uint8Array([]),
      secretKey: bytes,
    })
  }
}

export type KnownKeyPair =
  | Ed25519KeyPair
  | X25519KeyPair
  | P256KeyPair
  | K256KeyPair

export abstract class AsKnownKeyPair {
  abstract keyAlg(): KnownKeyAlgorithm
  abstract asKeyPair(): KnownKeyPair

  asEd25519(): Ed25519KeyPair {
    if (this.keyAlg() !== KnownKeyAlgorithm.Ed25519) {
      throw new DIDCommError(
        `Unexpected key algorithm! Expected Ed25519, got ${this.keyAlg()} `
      )
    }

    const keyPair = this.asKeyPair()
    if (keyPair instanceof Ed25519KeyPair) return keyPair
    throw new DIDCommError(`Unexpected key pair type! Expected Ed25519`)
  }

  asX25519(): X25519KeyPair {
    if (this.keyAlg() !== KnownKeyAlgorithm.X25519) {
      throw new DIDCommError(
        `Unexpected key algorithm! Expected X25519, got ${this.keyAlg()} `
      )
    }

    const keyPair = this.asKeyPair()
    if (keyPair instanceof X25519KeyPair) return keyPair
    throw new DIDCommError(`Unexpected key pair type! Expected X25519`)
  }

  asP256(): P256KeyPair {
    if (this.keyAlg() !== KnownKeyAlgorithm.P256) {
      throw new DIDCommError(
        `Unexpected key algorithm! Expected P256, got ${this.keyAlg()} `
      )
    }

    const keyPair = this.asKeyPair()
    if (keyPair instanceof P256KeyPair) return keyPair
    throw new DIDCommError(`Unexpected key pair type! Expected P256`)
  }

  asK256(): K256KeyPair {
    if (this.keyAlg() !== KnownKeyAlgorithm.K256) {
      throw new DIDCommError(
        `Unexpected key algorithm! Expected K256, got ${this.keyAlg()} `
      )
    }

    const keyPair = this.asKeyPair()
    if (keyPair instanceof K256KeyPair) return keyPair
    throw new DIDCommError(`Unexpected key pair type! Expected K256`)
  }
}

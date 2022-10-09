import { DIDCommError } from '../error'

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
  public publicKey: Uint8Array
  public secretKey?: Uint8Array

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

  static fromJwkJson(json: Record<string, unknown>) {
    return new X25519KeyPair({
      publicKey: new Uint8Array([]),
      secretKey: new Uint8Array([]),
    })
  }

  static fromSecretBytes(bytes: Uint8Array) {
    return new X25519KeyPair({
      publicKey: new Uint8Array([]),
      secretKey: bytes,
    })
  }
}

// TODO: calculate K based on T
export type KnownKeyPair<
  T = 'Ed25519' | 'X25519' | 'P256' | 'K256',
  K = Ed25519KeyPair | X25519KeyPair | P256KeyPair | K256KeyPair
> = {
  type: T
  keyPair: K
}

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
    if (keyPair.type === 'Ed25519') return keyPair.keyPair as Ed25519KeyPair
    throw new DIDCommError(
      `Unexpected key pair type! Expected Ed25519, got ${this.asKeyPair().type}`
    )
  }

  asX25519(): X25519KeyPair {
    if (this.keyAlg() !== KnownKeyAlgorithm.X25519) {
      throw new DIDCommError(
        `Unexpected key algorithm! Expected X25519, got ${this.keyAlg()} `
      )
    }

    const keyPair = this.asKeyPair()
    if (keyPair.type === 'X25519') return keyPair.keyPair as X25519KeyPair
    throw new DIDCommError(
      `Unexpected key pair type! Expected X25519, got ${this.asKeyPair().type}`
    )
  }

  asP256(): P256KeyPair {
    if (this.keyAlg() !== KnownKeyAlgorithm.P256) {
      throw new DIDCommError(
        `Unexpected key algorithm! Expected P256, got ${this.keyAlg()} `
      )
    }

    const keyPair = this.asKeyPair()
    if (keyPair.type === 'P256') return keyPair.keyPair as P256KeyPair
    throw new DIDCommError(
      `Unexpected key pair type! Expected P256, got ${this.asKeyPair().type}`
    )
  }

  asK256(): K256KeyPair {
    if (this.keyAlg() !== KnownKeyAlgorithm.K256) {
      throw new DIDCommError(
        `Unexpected key algorithm! Expected K256, got ${this.keyAlg()} `
      )
    }

    const keyPair = this.asKeyPair()
    if (keyPair.type === 'K256') return keyPair.keyPair as K256KeyPair
    throw new DIDCommError(
      `Unexpected key pair type! Expected K256, got ${this.asKeyPair().type}`
    )
  }
}

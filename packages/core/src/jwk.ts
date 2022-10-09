// TODO: askar_crypto::jwk::FromJwk
export class FromJwk {
  public fromJwk(jwk: string) {}
}

export class FromJwkJson extends FromJwk {
  public fromjwkJson(jwk: Record<string, unknown>) {
    const serializedJwk = JSON.stringify(jwk)
    return this.fromJwk(serializedJwk)
  }
}

// TODO: askar_crypto::jwk::ToJwk
export class ToJwk {
  toJwkPublic(jwk?: string): string {
    return 'TODO: JWK'
  }
}

export class ToJwkJson extends ToJwk {
  public toJwkPublicJson(): Record<string, unknown> {
    const jwk = this.toJwkPublic(undefined)

    return JSON.parse(jwk)
  }
}

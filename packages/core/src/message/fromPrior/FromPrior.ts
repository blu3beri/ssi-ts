import { didOrUrl, isDid } from '../../utils'
import { DIDCommError } from '../../error'
import { DIDResolver } from '../../did'
import { SecretsResolver } from '../../secrets'
import { Jws, JWSAlgorithm, KeySign } from '../../jws'
import { Buffer } from 'buffer'

export class FromPrior {
  public iss: string
  public sub: string
  public aud?: string
  public exp?: number
  public nbf?: number
  public iat?: number
  public jti?: string

  public constructor({
    iss,
    sub,
    aud,
    exp,
    iat,
    jti,
    nbf,
  }: {
    iss: string
    sub: string
    aud?: string
    exp?: number
    nbf?: number
    iat?: number
    jti?: string
  }) {
    this.iss = iss
    this.sub = sub
    this.aud = aud
    this.exp = exp
    this.nbf = nbf
    this.iat = iat
    this.jti = jti
  }

  public async pack({
    didResolver,
    secretsResolver,
    issuerKid,
  }: {
    didResolver: DIDResolver
    secretsResolver: SecretsResolver
    issuerKid?: string
  }): Promise<{ fromPriorJwt: string; kid: string }> {
    // TODO: does this automatically bubble-up?
    this.validatePack(issuerKid)

    const fromPriorString = JSON.stringify(this)

    const didDoc = await didResolver.resolve(this.iss)

    if (!didDoc) throw new DIDCommError('Unable to resolve issuer DID')

    const authenticationKids: Array<string> = []

    if (issuerKid) {
      const { did, didUrl: kid } = didOrUrl(issuerKid)

      if (!kid) throw new DIDCommError('issuerKid content is not a DID URL')

      if (did !== this.iss) {
        throw new DIDCommError('issuerKid does not belong to `iss`')
      }

      const authKid = didDoc.authentications.find((a) => a === kid)
      if (!authKid) {
        throw new DIDCommError('provided issuerKid is not found in DIDDoc')
      }

      authenticationKids.push(authKid)
    } else {
      didDoc.authentications.forEach((a) => authenticationKids.push(a))
    }

    const kid = await secretsResolver.findSecrets(authenticationKids)[0]
    if (!kid) throw new DIDCommError('No issuer secrets found')

    const secret = await secretsResolver.getSecret(kid)
    if (!secret) throw new DIDCommError('Unable to find secret for issuer')

    const signKeyPair = secret.asKeyPair()

    const fromPriorJwt = Jws.signCompact({
      payload: Buffer.from(fromPriorString),
      // TODO: handle keysign
      signer: { kid, key: new KeySign() },
      typ: 'JWT',
      // TODO: also map es256k and es256
      algorithm: 'EdDSA',
    })

    return { fromPriorJwt, kid: JSON.stringify(kid) }
  }

  public validatePack(issuerKid?: string) {
    if (!isDid(this.iss) || didOrUrl(this.iss).didUrl) {
      throw new DIDCommError('`iss` must be a non-fragment DID')
    }

    if (!isDid(this.sub) || didOrUrl(this.sub).didUrl) {
      throw new DIDCommError('`sub` must be a non-fragment DID')
    }

    if (this.iss === this.sub) {
      throw new DIDCommError('`sub` and `iss` must not be equal')
    }

    if (issuerKid) {
      const { didUrl: kid, did } = didOrUrl(issuerKid)

      if (!kid) throw new DIDCommError('issuerKid content is not a DID URL')

      if (did !== this.iss) {
        throw new DIDCommError('issuerKid does not belong to `iss`')
      }
    }

    return true
  }
}

export class FromPriorBuilder {
  private fromPrior: FromPrior

  public constructor(fromPrior: { iss: string; sub: string }) {
    this.fromPrior = new FromPrior(fromPrior)
  }

  public finalize() {
    return this.fromPrior
  }

  public set aud(aud: string) {
    this.fromPrior.aud = aud
  }

  public set exp(exp: number) {
    this.fromPrior.exp = exp
  }

  public set nbf(nbf: number) {
    this.fromPrior.nbf = nbf
  }

  public set iat(iat: number) {
    this.fromPrior.iat = iat
  }

  public set jti(jti: string) {
    this.fromPrior.jti = jti
  }
}

import { DIDCommError } from '../error'
import { JWSAlgorithm, KeySign, ParsedCompactJWS, signCompact } from '../jws'
import { b64UrlSafe, didOrUrl, isDid } from '../utils'
import { Buffer } from 'buffer'
import {
  assertDidProvider,
  assertSecretProvider,
  didProvider,
  secretsProvider,
} from '../providers'

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

  public static fromString(s: string): FromPrior {
    const parsed = JSON.parse(s)
    return new FromPrior(parsed)
  }

  public async pack({
    issuerKid,
  }: {
    issuerKid?: string
  }): Promise<{ fromPriorJwt: string; kid: string }> {
    assertDidProvider(['resolve'])
    assertSecretProvider(['findSecrets', 'getSecret'])

    this.validatePack(issuerKid)

    const fromPriorString = JSON.stringify(this)

    const didDoc = await didProvider.resolve!(this.iss)

    if (!didDoc) throw new DIDCommError('Unable to resolve issuer DID')

    const authenticationKids: Array<string> = []

    if (!didDoc.authentication) {
      throw new DIDCommError('Authentication field not found in did doc')
    }

    if (issuerKid) {
      const { did, didUrl: kid } = didOrUrl(issuerKid)

      if (!kid) throw new DIDCommError('issuerKid content is not a DID URL')

      if (did !== this.iss) {
        throw new DIDCommError('issuerKid does not belong to `iss`')
      }

      const authKid = didDoc.authentication.find((a) => a === kid)
      if (!authKid) {
        throw new DIDCommError('provided issuerKid is not found in DIDDoc')
      }

      authenticationKids.push(authKid)
    } else {
      didDoc.authentication.forEach((a) => authenticationKids.push(a))
    }

    const kid = (await secretsProvider.findSecrets!(authenticationKids))[0]
    if (!kid) throw new DIDCommError('No issuer secrets found')

    const secret = await secretsProvider.getSecret!(kid)
    if (!secret) throw new DIDCommError('Unable to find secret for issuer')

    const signKeyPair = secret.asKeyPair()

    const fromPriorJwt = signCompact({
      payload: Buffer.from(fromPriorString),
      // TODO: handle keysign
      signer: { kid, key: new KeySign() },
      typ: 'JWT',
      // TODO: also map es256k and es256
      alg: JWSAlgorithm.EdDSA,
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

  public static async unpack({
    fromPriorJwt,
  }: {
    fromPriorJwt: string
  }): Promise<{ fromPrior: FromPrior; kid: string }> {
    assertDidProvider(['resolve'])

    const parsed = ParsedCompactJWS.parseCompact(fromPriorJwt)
    const typ = parsed.parsedHeader.typ
    const alg = parsed.parsedHeader.alg
    const kid = parsed.parsedHeader.kid

    if (typ !== 'JWT') {
      throw new DIDCommError('fromPrior is malformed: typ is not JWT')
    }

    const { did, didUrl } = didOrUrl(kid)
    if (!did) throw new DIDCommError('DID not fround from kid')
    if (!didUrl) throw new DIDCommError('fromPrior kid is not DID URL')

    const didDoc = await didProvider.resolve!(did)
    if (!didDoc) throw new DIDCommError('fromPrior issuer DIDDoc not found')

    if (!didDoc.authentication) {
      throw new DIDCommError('authentication field not found in did doc')
    }

    const kidFromDidDoc = didDoc.authentication.find((a) => a === kid)
    if (!kidFromDidDoc) {
      throw new DIDCommError('fromPrior issuer kid not found in DIDDoc')
    }

    if (!didDoc.verificationMethod) {
      throw new DIDCommError('authentication field not found in did doc')
    }

    const key = didDoc.verificationMethod.find((v) => v.id === kid)
    if (!key) {
      throw new DIDCommError(
        'fromPrior issuer verification method not found in DIDDoc'
      )
    }

    const valid = false
    switch (alg) {
      case JWSAlgorithm.EdDSA:
        // TODO
        break
      case JWSAlgorithm.Es256:
        // TODO
        break
      case JWSAlgorithm.Es256K:
        // TODO
        break
      default:
        throw new DIDCommError(`Unsuppored signature algorithm. ${alg}`)
    }

    if (!valid) throw new DIDCommError('wrong fromPrior signature')

    const payload = b64UrlSafe.decode(parsed.payload)
    const deserializedPayload = Buffer.from(payload).toString()
    const fromPrior = FromPrior.fromString(deserializedPayload)

    return { fromPrior, kid }
  }
}

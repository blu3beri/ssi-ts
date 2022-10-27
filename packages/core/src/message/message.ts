import type { PackSignedMetadata } from './PackSignedMetadata'
import { Attachment } from './attachment'
import { DIDResolver } from '../did'
import { FromPrior } from './fromPrior'
import { DIDCommError } from '../error'
import { SecretsResolver } from '../secrets'
import { didOrUrl, isDid } from '../utils'
import { JWSAlgorithm, KeySign, sign } from '../jws'
import { Buffer } from 'buffer'

export type TMessage = {
  id: string
  typ?: 'application/didcomm-plain+json'
  type: string
  body: Record<string, unknown>
  from?: string
  to?: Array<string>
  thid?: string
  pthid?: string
  extraHeaders?: Record<string, unknown>
  createdTime?: number
  expiresTime?: number
  fromPrior?: string
  attachments?: Array<Attachment>
}

export class Message {
  public id: string
  public typ: 'application/didcomm-plain+json'
  public type: string
  public body: Record<string, unknown>
  public from?: string
  public to?: Array<string>
  public thid?: string
  public pthid?: string
  public extraHeaders?: Record<string, unknown>
  public createdTime?: number
  public expiresTime?: number
  public fromPrior?: string
  public attachments?: Array<Attachment>

  public constructor(options: TMessage) {
    this.id = options.id
    this.typ = 'application/didcomm-plain+json'
    this.type = options.type
    this.body = options.body
    this.from = options.from
    this.to = options.to
    this.thid = options.thid
    this.pthid = options.pthid
    this.extraHeaders = options.extraHeaders
    this.createdTime = options.createdTime
    this.expiresTime = options.expiresTime
    this.fromPrior = options.fromPrior
    this.attachments = options.attachments
  }

  public fromString(s: string) {
    const obj = JSON.parse(s)
    if (!obj.id || !obj.type || !obj.body) {
      throw new DIDCommError(
        `string: ${s} does not contain either: 'id', 'type' or 'body'`
      )
    }
    return new Message(JSON.parse(s))
  }

  public async packPlaintext(didResolver: DIDResolver): Promise<string> {
    let kid: string | undefined
    let fromPrior: FromPrior | undefined
    if (this.fromPrior) {
      const res = await FromPrior.unpack({
        fromPriorJwt: this.fromPrior,
        didResolver,
      })
      kid = res.kid
      fromPrior = res.fromPrior
    }

    this.validatePackPlaintext(fromPrior, kid)

    // TODO: does this serialization work like this?
    return JSON.stringify(this)
  }

  private validatePackPlaintext(
    fromPrior?: FromPrior,
    fromPriorIssuerKid?: string
  ) {
    if (fromPrior) {
      fromPrior.validatePack(fromPriorIssuerKid)
      if (this.from && fromPrior.sub !== this.from) {
        throw new DIDCommError(
          'fromPrior `sub` value is not equal to message `from` value'
        )
      }
    }
  }

  public async packSigned(
    signBy: string,
    didResolver: DIDResolver,
    secretsResolver: SecretsResolver
  ): Promise<{ message: string; packSignedMetadata: PackSignedMetadata }> {
    this.validatePackSigned(signBy)

    const { did, didUrl } = didOrUrl(signBy)

    if (!did) throw new DIDCommError('Could not get did from `signBy` field')

    const didDoc = await didResolver.resolve(did)

    if (!didDoc) {
      throw new DIDCommError('Unable to resolve signer DID')
    }

    if (!didDoc.authentication) {
      throw new DIDCommError('Authentication field not found on did document')
    }

    const authentications: Array<string> = []

    if (didUrl) {
      if (!didDoc.authentication.find((a) => a === didUrl)) {
        throw new DIDCommError(
          'Signer key id not found in did doc authentication field'
        )
      }
      authentications.push(didUrl)
    } else {
      authentications.push(...didDoc.authentication)
    }

    const keyId = await secretsResolver.findSecrets(authentications)[0]
    if (!keyId) {
      throw new DIDCommError(`Could not resolve secrets for ${authentications}`)
    }

    const secret = await secretsResolver.getSecret(keyId)
    if (!secret) {
      throw new DIDCommError(`Could not find signer secret for ${keyId}`)
    }

    const signKey = secret.asKeyPair()

    const payload = await this.packPlaintext(didResolver)

    const algorithm =
      signKey.type === 'Ed25519'
        ? JWSAlgorithm.EdDSA
        : signKey.type === 'P256'
        ? JWSAlgorithm.Es256
        : signKey.type === 'K256'
        ? JWSAlgorithm.Es256K
        : undefined

    if (!algorithm)
      throw new DIDCommError(`Unsupported signature algorithm ${signKey.type}`)

    const message = sign({
      payload: Buffer.from(payload),
      alg: algorithm,
      // TODO: all the keypairs should implement keySign
      signer: { kid: keyId, key: signKey.keyPair as unknown as KeySign },
    })

    return {
      message,
      packSignedMetadata: { signByKid: keyId },
    }
  }

  private validatePackSigned(signBy: string) {
    if (!isDid(signBy)) {
      throw new DIDCommError('`sign_from` value is not a valid DID or DID URL')
    }
  }
}

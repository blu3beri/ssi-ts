import type { PackSignedMetadata } from './PackSignedMetadata'
import { Attachment } from './attachment'
import { FromPrior } from './fromPrior'
import { DIDCommError } from '../error'
import { didOrUrl, isDid } from '../utils'
import { JwsAlgorithm, sign } from '../jws'
import { Buffer } from 'buffer'
import {
  hasKeyAgreementSecret,
  tryUnpackAnoncrypt,
  tryUnpackAuthcrypt,
  tryUnpackPlaintext,
  tryUnpackSign,
  UnpackMetadata,
  UnpackOptions,
} from './unpack'
import { tryParseForward } from '../protocols/routing'
import { assertDidProvider, assertSecretsProvider } from '../providers'
import { Ed25519KeyPair, K256KeyPair, P256KeyPair } from '../crypto'
import { Secrets } from '../secrets'
import { DidResolver } from '../did'

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
      throw new DIDCommError(`string: ${s} does not contain either: 'id', 'type' or 'body'`)
    }
    return new Message(JSON.parse(s))
  }

  public async packPlaintext(): Promise<string> {
    let kid: string | undefined
    let fromPrior: FromPrior | undefined
    if (this.fromPrior) {
      const res = await FromPrior.unpack({
        fromPriorJwt: this.fromPrior,
      })
      kid = res.kid
      fromPrior = res.fromPrior
    }

    this.validatePackPlaintext(fromPrior, kid)

    // TODO: does this serialization work like this?
    return JSON.stringify(this)
  }

  private validatePackPlaintext(fromPrior?: FromPrior, fromPriorIssuerKid?: string) {
    if (fromPrior) {
      fromPrior.validatePack(fromPriorIssuerKid)
      if (this.from && fromPrior.sub !== this.from) {
        throw new DIDCommError('fromPrior `sub` value is not equal to message `from` value')
      }
    }
  }

  public async packSigned(signBy: string): Promise<{ message: string; packSignedMetadata: PackSignedMetadata }> {
    assertDidProvider(['resolve'])
    assertSecretsProvider(['findSecrets', 'getSecret'])
    this.assertPackSigned(signBy)

    const { did, didUrl } = didOrUrl(signBy)

    if (!did) throw new DIDCommError('Could not get did from `signBy` field')

    const didDoc = await DidResolver.resolve!(did)

    if (!didDoc) {
      throw new DIDCommError('Unable to resolve signer DID')
    }

    if (!didDoc.authentication) {
      throw new DIDCommError('Authentication field not found on did document')
    }

    const authentications: Array<string> = []

    if (didUrl) {
      if (!didDoc.authentication.find((a) => a === didUrl)) {
        throw new DIDCommError('Signer key id not found in did doc authentication field')
      }
      authentications.push(didUrl)
    } else {
      didDoc.authentication.forEach((a) => authentications.push(typeof a === 'string' ? a : a.id))
    }

    const keyId = (await Secrets.findSecrets!(authentications))[0]
    if (!keyId) {
      throw new DIDCommError(`Could not resolve secrets for ${authentications}`)
    }

    const secret = await Secrets.getSecret!(keyId)
    if (!secret) {
      throw new DIDCommError(`Could not find signer secret for ${keyId}`)
    }

    const signKey = await secret.asKeyPair()

    const payload = await this.packPlaintext()

    const algorithm =
      signKey instanceof Ed25519KeyPair
        ? JwsAlgorithm.EdDSA
        : signKey instanceof P256KeyPair
        ? JwsAlgorithm.Es256
        : signKey instanceof K256KeyPair
        ? JwsAlgorithm.Es256K
        : undefined

    if (!algorithm) throw new DIDCommError(`Unsupported signature algorithm ${signKey}`)

    const message = await sign({
      payload: Buffer.from(payload),
      alg: algorithm,
      // TODO: all the keypairs should implement keySign
      signer: { kid: keyId, signer: signKey },
    })

    return {
      message,
      packSignedMetadata: { signByKid: keyId },
    }
  }

  private assertPackSigned(signBy: string) {
    if (!isDid(signBy)) {
      throw new DIDCommError('`sign_from` value is not a valid DID or DID URL')
    }
  }

  private async tryUnwrapForwardedMessage({ message }: { message: string }): Promise<undefined | string> {
    let plaintext: Message | undefined
    try {
      plaintext = this.fromString(message)
    } catch {
      return undefined
    }

    const parsedForward = tryParseForward(plaintext)
    if (!parsedForward) return undefined

    if (
      await hasKeyAgreementSecret({
        didOrKid: parsedForward.next,
      })
    ) {
      return JSON.stringify(parsedForward.forwardedMessage)
    }
  }

  public async unpack({
    message,
    options,
  }: {
    message: string
    options: UnpackOptions
  }): Promise<{ message: Message; metadata: UnpackMetadata }> {
    const metadata: UnpackMetadata = {
      encrypted: false,
      authenticated: false,
      nonRepudiation: false,
      anonymousSender: false,
      reWrappedInForward: false,
    }

    let msg: string = message
    let anoncrypted: string | undefined
    let forwardedMessage: string

    while (true) {
      anoncrypted = await tryUnpackAnoncrypt({
        message: msg,
        options,
        metadata,
      })

      if (options.unwrapReWrappingForward && anoncrypted) {
        const forwardMessageOptions = await this.tryUnwrapForwardedMessage({
          message: anoncrypted,
        })
        if (forwardMessageOptions) {
          forwardedMessage = forwardMessageOptions
          msg = forwardedMessage
          metadata.reWrappedInForward = true
          continue
        }
      }
      break
    }
    msg = anoncrypted ?? msg

    const authcrypted = await tryUnpackAuthcrypt({
      message: msg,
      metadata,
      options,
    })
    msg = authcrypted ?? msg

    const signed = await tryUnpackSign({ message: msg, metadata })
    msg = signed ?? msg

    const plaintext = await tryUnpackPlaintext({
      message: msg,
      metadata,
    })
    if (!plaintext) {
      throw new DIDCommError('Message is not a valid JWE, JWS or JWM')
    }
    return { message: plaintext, metadata }
  }
}

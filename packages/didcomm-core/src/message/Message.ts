import type { PackEncryptedMetadata } from './PackEncryptedMetadata'
import type { MessagingServiceMetadata, PackEncryptedOptions } from './PackEncryptedOptions'
import type { PackSignedMetadata } from './PackSignedMetadata'
import type { Attachment } from './attachment'
import type { UnpackMetadata, UnpackOptions } from './unpack'

import { Buffer } from 'buffer'

import { AnonCryptAlgorithm, AuthCryptAlgorithm } from '../algorithms'
import { Ed25519KeyPair, K256KeyPair, P256KeyPair } from '../crypto'
import { DidResolver } from '../did'
import { DIDCommError } from '../error'
import { JwsAlgorithm, sign } from '../jws'
import { tryParseForward } from '../protocols/routing/tryParseForward'
import { wrapInForwardIfNeeded } from '../protocols/routing/wrapForwardIfNeeded'
import { assertDidProvider, assertSecretsProvider } from '../providers'
import { Secrets } from '../secrets'
import { didOrUrl, isDid } from '../utils'

import { FromPrior } from './FromPrior'
import { anoncrypt, authcrypt } from './pack'
import {
  hasKeyAgreementSecret,
  tryUnpackAnoncrypt,
  tryUnpackAuthcrypt,
  tryUnpackPlaintext,
  tryUnpackSign,
} from './unpack'

type MessageProps = {
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

  public constructor(options: MessageProps) {
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

  public static fromString(s: string) {
    const obj = JSON.parse(s) as { id?: string; type?: string; body?: Record<string, unknown> }
    if (!obj.id || !obj.type || !obj.body) {
      throw new DIDCommError(`string: ${s} does not contain either: 'id', 'type' or 'body'`)
    }
    return new Message(JSON.parse(s) as MessageProps)
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

  public async packEncrypted({
    to,
    options,
    from,
    signBy,
  }: {
    to: string
    from?: string
    signBy?: string
    options?: PackEncryptedOptions
  }) {
    options ??= {
      protectedSender: false,
      forward: true,
      encAlgAnon: AnonCryptAlgorithm.Xc20pEcdhEsA256kw,
      encAlgAuth: AuthCryptAlgorithm.A256cbcHs512Ecdh1puA256kw,
    }

    let message: string | undefined
    let signByKid: string | undefined
    let fromKid: string | undefined
    let toKids: Array<string> | undefined
    let messagingService: MessagingServiceMetadata | undefined
    if (signBy) {
      const {
        message: msg,
        packSignedMetadata: { signByKid: sbk },
      } = await this.packSigned(signBy)
      message = msg
      signByKid = sbk
    } else {
      message = await this.packPlaintext()
    }

    if (from) {
      const {
        toKids: tk,
        fromKid: fk,
        message: m,
      } = await authcrypt({ to, from, message: Uint8Array.from(Buffer.from(message)), ...options })
      message = m
      toKids = tk
      fromKid = fk
    } else {
      const { message: m, toKids: tk } = await anoncrypt({
        to,
        message: Uint8Array.from(Buffer.from(message)),
        ...options,
      })
      message = m
      toKids = tk
    }

    const maybeWrapped = await wrapInForwardIfNeeded({ message, to, options })
    if (maybeWrapped) {
      message = maybeWrapped.forwardMessage
      messagingService = maybeWrapped.metadata
    }

    const metadata: PackEncryptedMetadata = {
      messagingService,
      toKids,
      fromKid,
      signByKid,
    }

    return { message, metadata }
  }

  public async packSigned(signBy: string): Promise<{ message: string; packSignedMetadata: PackSignedMetadata }> {
    assertDidProvider(['resolve'])
    assertSecretsProvider(['findSecrets', 'getSecret'])
    this.assertPackSigned(signBy)

    const { did, didUrl } = didOrUrl(signBy)

    if (!did) throw new DIDCommError('Could not get did from `signBy` field')

    const didDoc = await DidResolver.resolve(did)

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

    const keyId = (await Secrets.findSecrets(authentications))[0]
    if (!keyId) {
      throw new DIDCommError(`Could not resolve secrets for ${authentications.toString()}`)
    }

    const secret = await Secrets.getSecret(keyId)
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

    if (!algorithm) throw new DIDCommError(`Unsupported signature algorithm ${signKey.toString()}`)

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

  private static async tryUnwrapForwardedMessage({ message }: { message: string }): Promise<undefined | string> {
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

  public static async unpack({
    message,
    options,
  }: {
    message: string
    options?: UnpackOptions
  }): Promise<{ message: Message; metadata: UnpackMetadata }> {
    options ??= {
      expectDecryptByAllKeys: false,
      unwrapReWrappingForward: true,
    }
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

    for (;;) {
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

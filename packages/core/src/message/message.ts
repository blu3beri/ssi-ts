import { Attachment } from './attachment'
import { DIDResolver } from '../did'
import { FromPrior } from './fromPrior'

export type TMessage = {
  id: string
  typ: 'application/didcomm-plain+json'
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

  public constructor({
    id,
    type,
    body,
    from,
    to,
    thid,
    pthid,
    extraHeaders,
    createdTime,
    expiresTime,
    fromPrior,
    attachments,
  }: {
    id: string
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
  }) {
    this.id = id
    this.typ = 'application/didcomm-plain+json'
    this.type = type
    this.body = body
    this.from = from
    this.to = to
    this.thid = thid
    this.pthid = pthid
    this.extraHeaders = extraHeaders
    this.createdTime = createdTime
    this.expiresTime = expiresTime
    this.fromPrior = fromPrior
    this.attachments = attachments
  }

  public build({
    id,
    type,
    body,
  }: {
    id: string
    type: string
    body: Record<string, unknown>
  }) {
    return new MessageBuilder({ id, type, body })
  }

  public fromString(s: string) {
    return new Message(JSON.parse(s))
  }

  public validate() {
    if (this.typ !== 'application/didcomm-plain+json') return false
    return true
  }

  public packPlaintext(didResolver: DIDResolver): string {}

  private validatePackPlaintext(
    fromPrior?: FromPrior,
    fromPriorIssuerKid?: string
  ): boolean {
    if (!fromPrior) return true
  }
}

export class MessageBuilder {
  private message: Message

  public constructor(msg: {
    id: string
    type: string
    body: Record<string, unknown>
  }) {
    this.message = new Message(msg)
  }

  public finalize() {
    return this.message
  }

  public set to(to: Array<string> | string) {
    this.message.to = typeof to === 'string' ? [to] : to
  }

  public set from(from: string) {
    this.message.from = from
  }

  public set thid(thid: string) {
    this.message.thid = thid
  }

  public set pthid(pthid: string) {
    this.message.pthid = pthid
  }

  public set header({ key, value }: { key: string; value: string }) {
    this.message.extraHeaders[key] = value
  }

  public set createdTime(createdTime: number) {
    this.message.createdTime = createdTime
  }

  public set expiresTime(expiresTime: number) {
    this.message.expiresTime = expiresTime
  }

  public set fromPrior(fromPrior: string) {
    this.message.fromPrior = fromPrior
  }

  public set attachment(attachment: Array<Attachment> | Attachment) {
    const attachments = Array.isArray(attachment) ? attachment : [attachment]
    if (Array.isArray(this.message.attachments)) {
      attachments.forEach((a) => this.message.attachments.push(a))
    } else {
      this.message.attachments = attachments
    }
  }
}

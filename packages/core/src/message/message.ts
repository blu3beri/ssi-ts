import { Attachment } from './attachment'
import { DIDResolver } from '../did'
import { FromPrior } from './fromPrior'
import { DIDCommError } from '../error'

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

  public packPlaintext(didResolver: DIDResolver): string {}

  private validatePackPlaintext(
    fromPrior?: FromPrior,
    fromPriorIssuerKid?: string
  ): boolean {
    if (!fromPrior) return true
  }
}

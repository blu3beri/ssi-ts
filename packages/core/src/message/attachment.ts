export type Attachment = {
  data: AttachmentData
  id?: string
  description?: string
  filename?: string
  mediaType?: string
  format?: string
  lastmodTime?: string
  byteCount?: number
}

// TODO: this is an enum
export type AttachmentData = {
  Base64?: Base64AttachmentData
  Json?: JsonAttachmentData
  Links?: LinksAttachmentData
}

export type Base64AttachmentData = {
  base64: string
  jws?: string
}

export type JsonAttachmentData = {
  json: Record<string, unknown>
  jws?: string
}

export type LinksAttachmentData = {
  links: Array<string>
  hash: string
  jws?: string
}

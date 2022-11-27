import type { Attachment } from '../../message'
import { Message } from '../../message'
import { generateMessageId } from '../../utils'
import { FORWARD_MESSAGE_TYPE } from './constants'

export const buildForwardMessage = ({
  next,
  forwardMessage,
  headers,
}: {
  forwardMessage: string
  next: string
  headers?: Record<string, unknown>
}) => {
  const body = { next }

  const attachment: Attachment = {
    data: { Json: JSON.parse(forwardMessage) },
  }

  const message = new Message({
    id: generateMessageId(),
    type: FORWARD_MESSAGE_TYPE,
    body,
    extraHeaders: headers,
    attachments: [attachment],
  })

  return JSON.stringify(message)
}

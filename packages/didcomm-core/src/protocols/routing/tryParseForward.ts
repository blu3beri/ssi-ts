import type { Message } from '../../message'
import type { ParsedForward } from '../ParsedForward'

import { FORWARD_MESSAGE_TYPE } from './constants'

export const tryParseForward = (message: Message): ParsedForward | undefined => {
  if (message.type !== FORWARD_MESSAGE_TYPE) {
    return undefined
  }
  const next = message.body.next ? message.body.next : undefined

  if (!next || typeof next !== 'string') {
    return undefined
  }

  if (!message.attachments) return undefined

  const attachmentData = message.attachments[0].data.Json
  if (!attachmentData) return undefined

  return {
    message,
    next,
    forwardedMessage: attachmentData,
  }
}

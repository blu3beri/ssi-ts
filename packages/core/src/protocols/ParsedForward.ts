import { Message } from '../message'

export type ParsedForward = {
  message: Message
  next: string
  forwardedMessage: Record<string, unknown>
}

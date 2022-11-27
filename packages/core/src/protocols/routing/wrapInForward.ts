import type { AnonCryptAlgorithm } from '../../algorithms'

import { Buffer } from 'buffer'

import { DIDCommError } from '../../error'
import { anoncrypt } from '../../message'

import { buildForwardMessage } from './buildForwardMessage'

export const wrapInForward = async ({
  message,
  headers,
  to,
  encAlgAnon,
  routingKeys,
}: {
  message: string
  headers?: Record<string, unknown>
  to: string
  routingKeys: Array<string>
  encAlgAnon: AnonCryptAlgorithm
}): Promise<string> => {
  let tos = routingKeys
  let nexts = tos
  nexts.shift()
  nexts.push(to)

  tos = tos.reverse()
  nexts = nexts.reverse()

  let m = message

  for (let i = 0; i < tos.length; i++) {
    const to = tos[i]
    const next = nexts[i]
    m = buildForwardMessage({ forwardMessage: m, next, headers })
    const res = await anoncrypt({
      to,
      encAlgAnon,
      message: Uint8Array.from(Buffer.from(m)),
    })
    if (!res) throw new DIDCommError('Could not use anoncrypt')
    m = res.message
  }
  return m
}

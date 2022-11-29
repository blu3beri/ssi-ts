export const isDid = (did: string): boolean => {
  const parts = did.split(':')
  return parts.length >= 3 && parts[0] === 'did'
}

export const didOrUrl = (didOrUrl: string): { did?: string; didUrl?: string } => {
  if (!isDid(didOrUrl)) return {}

  const parts = didOrUrl.split('#')

  return {
    did: parts[0],
    didUrl: parts[1],
  }
}

export enum Codec {
  X25519Pub = 0xec,
  Ed25519pub = 0xed,
  X25519Priv = 0x1302,
  Ed25519Priv = 0x1200,
}

// TODO: implement fromMulticodec properly
export const fromMulticodec = (options: { codec: Codec; decodedValue: Uint8Array }) => options

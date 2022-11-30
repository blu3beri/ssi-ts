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

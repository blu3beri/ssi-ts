import type { DidProvider } from './DidProvider'

import { assertProvider } from '../utils'

export let didProvider: DidProvider

export const assertDidProvider = (fields: Array<keyof DidProvider>) => assertProvider(fields, didProvider)

export const setDidsProvider = (provider: DidProvider) => {
  didProvider = provider
}

import { assertProvider } from '../utils'
import { DidProvider } from './DidProvider'

export let didProvider: DidProvider

export const assertDidProvider = (fields: Array<keyof DidProvider>) => assertProvider(fields, didProvider)

export const setDidProvider = (provider: DidProvider) => {
  didProvider = provider
}

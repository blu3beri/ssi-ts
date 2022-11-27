import { assertProvider } from '../utils'
import type { SecretsProvider } from './SecretsProvider'

export let secretsProvider: SecretsProvider

export const assertSecretsProvider = (fields: Array<keyof SecretsProvider>) => assertProvider(fields, secretsProvider)

export const setSecretsProvider = (provider: SecretsProvider) => {
  secretsProvider = provider
}

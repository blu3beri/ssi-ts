import { SecretsProvider } from './SecretsProvider'
import { assertProvider } from '../utils'

export let secretsProvider: SecretsProvider

export const assertSecretsProvider = (fields: Array<keyof SecretsProvider>) => assertProvider(fields, secretsProvider)

export const setSecretsProvider = (provider: SecretsProvider) => {
  secretsProvider = provider
}

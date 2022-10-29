import { SecretsProvider } from './SecretsProvider'
import { assertProvider } from '../utils'

export let secretsProvider: SecretsProvider

export const assertSecretProvider = (fields: Array<keyof SecretsProvider>) =>
  assertProvider(fields, secretsProvider)

export const setSecretProvider = (provider: SecretsProvider) => {
  secretsProvider = provider
}

import { Secret } from '../../../secrets'
import { DIDCommError } from '../../../error'
import { secretsProvider, setSecretsProvider, assertSecretsProvider } from '../provider'
import { SecretsProvider } from '../SecretsProvider'

describe('secretsProvider tests', () => {
  beforeEach(() => {
    setSecretsProvider({})
  })

  test('Assert when no provider is set', () => {
    expect(() => assertSecretsProvider(['getSecret'])).toThrowError(DIDCommError)
  })

  test('Don\'t Assert when a provider is set', () => {
    const mockSecretsProivder = { findSecrets: jest.fn() }

    setSecretsProvider(mockSecretsProivder)

    expect(assertSecretsProvider(['findSecrets'])).toBeUndefined()
  })

  test('secretsProvider is registered and usable', () => {
    const mockSecretsProvider: SecretsProvider = {
      getSecret: jest.fn().mockResolvedValue(undefined),
    }

    setSecretsProvider(mockSecretsProvider)

    expect(secretsProvider.getSecret!('secretId')).resolves.toBeUndefined()
  })
})

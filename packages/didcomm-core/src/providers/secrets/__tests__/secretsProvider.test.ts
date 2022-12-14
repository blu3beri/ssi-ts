import type { SecretsProvider } from '../SecretsProvider'

import { DIDCommError } from '../../../error'
import { Secret } from '../../../secrets'
import { secretsProvider, setSecretsProvider, assertSecretsProvider } from '../provider'

describe('secretsProvider tests', () => {
  beforeEach(() => {
    setSecretsProvider({})
  })

  test('Assert when no provider is set', () => {
    expect(() => assertSecretsProvider(['getSecret'])).toThrowError(DIDCommError)
  })

  test("Don't Assert when a provider is set", () => {
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

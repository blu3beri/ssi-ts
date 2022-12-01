import { DIDCommError } from '../../../error'
import { didProvider, setDidsProvider, assertDidProvider } from '../provider'

describe('didProvider tests', () => {
  beforeEach(() => {
    setDidsProvider({})
  })

  test('Assert when no provider is set', () => {
    expect(() => assertDidProvider(['resolve'])).toThrowError(DIDCommError)
  })

  test("Don't Assert when a provider is set", () => {
    const mockDidProvider = { resolve: jest.fn() }

    setDidsProvider(mockDidProvider)

    expect(assertDidProvider(['resolve'])).toBeUndefined()
  })

  test('didProvider is registered and usable', () => {
    const mockDidProvider = {
      resolve: jest.fn().mockResolvedValue({ id: 'did:example:1' }),
    }

    setDidsProvider(mockDidProvider)

    expect(didProvider.resolve!('did:example:1')).resolves.toMatchObject({
      id: 'did:example:1',
    })
  })
})

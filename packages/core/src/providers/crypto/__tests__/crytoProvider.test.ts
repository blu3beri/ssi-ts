import { DIDCommError } from '../../../error'
import {
  assertCryptoProvider,
  setCryptoProvider,
  cryptoProvider,
} from '../provider'

describe('cryptoProvider tests', () => {
  beforeEach(() => {
    setCryptoProvider({})
  })

  test('Assert when no provider is set', () => {
    expect(() => assertCryptoProvider(['k256'])).toThrowError(DIDCommError)
  })

  test("Don't Assert when a provider is set", () => {
    const mockCryptoSigner = { sign: jest.fn() }
    const mockCryptoHasher = { hash: jest.fn() }

    setCryptoProvider({
      k256: mockCryptoSigner,
      ed25519: mockCryptoSigner,
      p256: mockCryptoSigner,
      x25519: mockCryptoSigner,
      sha256: mockCryptoHasher,
    })

    expect(
      assertCryptoProvider(['k256', 'ed25519', 'x25519', 'p256', 'sha256'])
    ).toBeUndefined()
  })

  test('cryptoProvider is registered and usable', () => {
    const mockCryptoSigner = {
      sign: jest.fn().mockReturnValue(new Uint8Array([1, 2, 3])),
    }

    setCryptoProvider({ ed25519: mockCryptoSigner })

    expect(
      cryptoProvider.ed25519!.sign(new Uint8Array([0, 0, 0]))
    ).toStrictEqual(new Uint8Array([1, 2, 3]))
  })
})

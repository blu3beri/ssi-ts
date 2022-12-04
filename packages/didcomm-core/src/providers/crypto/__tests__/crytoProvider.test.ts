import { Ed25519KeyPair } from '../../../crypto'
import { DIDCommError } from '../../../error'
import { assertCryptoProvider, setCryptoProvider, cryptoProvider } from '../provider'

describe('cryptoProvider tests', () => {
  beforeEach(() => {
    setCryptoProvider({})
  })

  test('Assert when no provider is set', () => {
    expect(() => assertCryptoProvider(['k256'])).toThrowError(DIDCommError)
  })

  test("Don't Assert when a provider is set", () => {
    const mockCryptoKeyPair = {
      sign: jest.fn(),
      verify: jest.fn(),
      fromJwkJson: jest.fn(),
      fromSecretBytes: jest.fn(),
      generate: jest.fn(),
    }

    const mockCryptoHasher = { hash: jest.fn() }

    setCryptoProvider({
      k256: mockCryptoKeyPair,
      ed25519: mockCryptoKeyPair,
      p256: mockCryptoKeyPair,
      x25519: mockCryptoKeyPair,
      sha256: mockCryptoHasher,
    })

    expect(assertCryptoProvider(['k256', 'ed25519', 'x25519', 'p256', 'sha256'])).toBeUndefined()
  })

  test('cryptoProvider is registered and usable', () => {
    const mockCryptoKeyPair = {
      generate: jest.fn().mockReturnValue(new Uint8Array([0])),
      sign: jest.fn().mockReturnValue(new Uint8Array([0])),
      verify: jest.fn().mockReturnValue(true),
      fromJwkJson: jest.fn().mockReturnValue(new Ed25519KeyPair({ publicKey: new Uint8Array([0]) })),
      fromSecretBytes: jest.fn().mockReturnValue(
        new Ed25519KeyPair({
          publicKey: new Uint8Array([0]),
          privateKey: new Uint8Array([1]),
        })
      ),
    }

    setCryptoProvider({ ed25519: mockCryptoKeyPair })

    expect(cryptoProvider.ed25519!.sign(new Uint8Array([0, 0, 0]), new Uint8Array([0]))).toStrictEqual(
      new Uint8Array([0])
    )

    expect(cryptoProvider.ed25519!.generate()).toStrictEqual(new Uint8Array([0]))

    expect(cryptoProvider.ed25519!.fromSecretBytes(new Uint8Array([0]))).toBeInstanceOf(Ed25519KeyPair)
  })
})

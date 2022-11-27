import { Ed25519KeyPair } from "../../../crypto"
import { DIDCommError } from "../../../error"
import { assertCryptoProvider, setCryptoProvider, cryptoProvider } from "../provider"

describe("cryptoProvider tests", () => {
  beforeEach(() => {
    setCryptoProvider({})
  })

  test("Assert when no provider is set", () => {
    expect(() => assertCryptoProvider(["k256"])).toThrowError(DIDCommError)
  })

  test("Don't Assert when a provider is set", () => {
    const mockCryptoKeyPair = {
      sign: jest.fn(),
      fromJwkJson: jest.fn(),
      fromSecretBytes: jest.fn(),
    }

    const mockCryptoHasher = { hash: jest.fn() }

    setCryptoProvider({
      k256: mockCryptoKeyPair,
      ed25519: mockCryptoKeyPair,
      p256: mockCryptoKeyPair,
      x25519: mockCryptoKeyPair,
      sha256: mockCryptoHasher,
    })

    expect(assertCryptoProvider(["k256", "ed25519", "x25519", "p256", "sha256"])).toBeUndefined()
  })

  test("cryptoProvider is registered and usable", () => {
    const mockCryptoKeyPair = {
      sign: jest.fn().mockResolvedValue(new Uint8Array([1, 2, 3])),
      fromJwkJson: jest.fn().mockResolvedValue(new Ed25519KeyPair({ publicKey: new Uint8Array([0]) })),
      fromSecretBytes: jest.fn().mockResolvedValue(
        new Ed25519KeyPair({
          publicKey: new Uint8Array([0]),
          privateKey: new Uint8Array([1]),
        })
      ),
    }

    setCryptoProvider({ ed25519: mockCryptoKeyPair })

    expect(cryptoProvider.ed25519!.sign(new Uint8Array([0, 0, 0]))).resolves.toStrictEqual(new Uint8Array([1, 2, 3]))

    expect(cryptoProvider.ed25519!.fromJwkJson({ mock: "jwk" })).resolves.toBeInstanceOf(Ed25519KeyPair)

    expect(cryptoProvider.ed25519!.fromSecretBytes(new Uint8Array([0]))).resolves.toBeInstanceOf(Ed25519KeyPair)
  })
})

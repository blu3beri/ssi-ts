import { DIDCommError } from "../../../error"
import { didProvider, setDidProvider, assertDidProvider } from "../provider"

describe("didProvider tests", () => {
  beforeEach(() => {
    setDidProvider({})
  })

  test("Assert when no provider is set", () => {
    expect(() => assertDidProvider(["resolve"])).toThrowError(DIDCommError)
  })

  test("Don't Assert when a provider is set", () => {
    const mockDidProvider = { resolve: jest.fn() }

    setDidProvider(mockDidProvider)

    expect(assertDidProvider(["resolve"])).toBeUndefined()
  })

  test("didProvider is registered and usable", () => {
    const mockDidProvider = {
      resolve: jest.fn().mockResolvedValue({ id: "did:example:1" }),
    }

    setDidProvider(mockDidProvider)

    expect(didProvider.resolve!("did:example:1")).resolves.toMatchObject({
      id: "did:example:1",
    })
  })
})

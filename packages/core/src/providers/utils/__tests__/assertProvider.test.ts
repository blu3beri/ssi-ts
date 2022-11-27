import { DIDCommError } from '../../../error'
import { assertProvider } from '../assertProvider'

describe('assertProvider', () => {
  test('Assert when no method is found', () => {
    // @ts-ignore
    expect(() => assertProvider(['method'], {})).toThrowError(DIDCommError)
  })
  test("Don't Assert when method is found", () => {
    expect(assertProvider(['method'], { method: jest.fn() })).toBeUndefined()
  })
})

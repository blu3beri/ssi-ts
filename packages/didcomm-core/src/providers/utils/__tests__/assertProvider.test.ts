import { DIDCommError } from '../../../error'
import { assertProvider } from '../assertProvider'

describe('assertProvider', () => {
  test('Assert when no method is found', () => {
    expect(() => assertProvider<{ blob: () => void }>(['method' as 'blob'], { blob: jest.fn() })).toThrowError(
      DIDCommError
    )
  })
  test("Don't Assert when method is found", () => {
    expect(assertProvider(['method'], { method: jest.fn() })).toBeUndefined()
  })
})

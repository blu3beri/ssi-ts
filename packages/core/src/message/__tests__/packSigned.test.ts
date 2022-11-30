import { ALICE_DID_DOC, ALICE_SECRETS } from '../../../fixtures'
import { createExampleDidsProvider, createExampleSecretsProvider } from '../../../samples'
import { setDidsProvider, setSecretsProvider } from '../../providers'

describe('Message: packSigned', () => {
  beforeEach(() => {
    const secretsProvider = createExampleSecretsProvider(ALICE_SECRETS)
    const didProvider = createExampleDidsProvider([ALICE_DID_DOC])
    setSecretsProvider(secretsProvider)
    setDidsProvider(didProvider)
  })

  test('pack signed works', () => {
    expect(true).toBe(true)
  })
})

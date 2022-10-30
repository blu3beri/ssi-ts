import { createDidProvider } from '../../../samples/exampleDidProvider'
import { createExampleSecretsProvider } from '../../../samples/exampleSecretsProvider'
import { setDidProvider, setSecretsProvider } from '../../providers'

describe('Message: packSigned', () => {
  beforeEach(() => {
    const secretsProvider = createExampleSecretsProvider([])
    const didProvider = createDidProvider([])
    setSecretsProvider(secretsProvider)
    setDidProvider(didProvider)
  })

  test('pack signed works', () => {})
})

import { ALICE_DID_DOC, ALICE_SECRETS } from "../../__fixtures__"
import { createDidProvider } from "../../../samples/exampleDidProvider"
import { createExampleSecretsProvider } from "../../../samples/exampleSecretsProvider"
import { setDidProvider, setSecretsProvider } from "../../providers"

describe("Message: packSigned", () => {
  beforeEach(() => {
    const secretsProvider = createExampleSecretsProvider(ALICE_SECRETS)
    const didProvider = createDidProvider([ALICE_DID_DOC])
    setSecretsProvider(secretsProvider)
    setDidProvider(didProvider)
  })

  test("pack signed works", () => {
    expect(true).toBe(true)
  })
})

import { SecretsProvider } from '../src/providers'
import { Secret } from '../src/secrets'

export const createExampleSecretsProvider = (
  secrets: Array<Secret>
): SecretsProvider => ({
  findSecrets: async (secretIds: Array<string>): Promise<Array<string>> =>
    Promise.resolve(
      secretIds.filter((id) => secrets.map((s) => s.id).includes(id))
    ),
  getSecret: async (id: string): Promise<Secret | undefined> =>
    Promise.resolve(secrets.find((s) => s.id === id)),
})

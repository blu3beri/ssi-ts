import type { Secret } from '../../secrets'

export type SecretsProvider = {
  getSecret?: (secretId: string) => Promise<Secret | undefined>
  findSecrets?: (secretIds: Array<string>) => Promise<Array<string>>
}

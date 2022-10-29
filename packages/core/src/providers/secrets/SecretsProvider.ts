import { Secret } from '../../secrets'

export type SecretsProvider = {
  getSecret?: (secretId: string) => Promise<Secret | undefined>
  getSecrets?: (secretIds: Array<string>) => Promise<Array<Secret>>
}

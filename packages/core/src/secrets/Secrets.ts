import { assertSecretsProvider, secretsProvider } from '../providers'
import { Secret } from './Secret'

export class Secrets {
  public static async findSecrets(
    secretIds: Array<string>
  ): Promise<Array<string>> {
    assertSecretsProvider(['findSecrets'])
    return secretsProvider.findSecrets!(secretIds)
  }

  public static async getSecret(secretId: string): Promise<Secret | undefined> {
    assertSecretsProvider(['getSecret'])
    return secretsProvider.getSecret!(secretId)
  }
}

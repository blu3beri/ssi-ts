import { Secret } from '../../secrets';
export declare type SecretsProvider = {
    getSecret?: (secretId: string) => Promise<Secret | undefined>;
    findSecrets?: (secretIds: Array<string>) => Promise<Array<string>>;
};

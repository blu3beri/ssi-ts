import { Secret } from './Secret';
export declare class Secrets {
    static findSecrets(secretIds: Array<string>): Promise<Array<string>>;
    static getSecret(secretId: string): Promise<Secret | undefined>;
}

import { KeyPair } from './KeyPair';
export declare class K256KeyPair extends KeyPair {
    sign(message: Uint8Array): Promise<Uint8Array>;
    static fromJwkJson(jwk: Record<string, unknown>): Promise<K256KeyPair>;
    static fromSecretBytes(secretBytes: Uint8Array): Promise<K256KeyPair>;
}

import { KeyPair } from './KeyPair';
export declare class P256KeyPair extends KeyPair {
    sign(message: Uint8Array): Promise<Uint8Array>;
    static fromJwkJson(jwk: Record<string, unknown>): Promise<P256KeyPair>;
    static fromSecretBytes(secretBytes: Uint8Array): Promise<P256KeyPair>;
}

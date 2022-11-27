import { KeyPair } from './KeyPair';
export declare class Ed25519KeyPair extends KeyPair {
    sign(message: Uint8Array): Promise<Uint8Array>;
    static fromJwkJson(jwk: Record<string, unknown>): Promise<Ed25519KeyPair>;
    static fromSecretBytes(secretBytes: Uint8Array): Promise<Ed25519KeyPair>;
}

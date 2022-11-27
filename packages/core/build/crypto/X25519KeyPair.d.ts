import { KeyPair } from './KeyPair';
export declare class X25519KeyPair extends KeyPair {
    sign(message: Uint8Array): Promise<Uint8Array>;
    static fromJwkJson(jwk: Record<string, unknown>): Promise<X25519KeyPair>;
    static fromSecretBytes(secretBytes: Uint8Array): Promise<X25519KeyPair>;
}

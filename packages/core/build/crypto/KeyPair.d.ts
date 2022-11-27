export declare abstract class KeyPair {
    publicKey: Uint8Array;
    privateKey?: Uint8Array;
    constructor({ publicKey, privateKey }: {
        publicKey: Uint8Array;
        privateKey?: Uint8Array;
    });
    abstract sign(message: Uint8Array): Promise<Uint8Array>;
    static fromJwkJson(_: Record<string, unknown>): unknown;
    static fromSecretBytes(_: Uint8Array): unknown;
}

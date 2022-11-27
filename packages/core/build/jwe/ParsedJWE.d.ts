import { ProtectedHeader } from './envelope';
import { Jwe } from './JWE';
import { Kdf, P256KeyPair, X25519KeyPair } from '../crypto';
export declare class ParsedJWE {
    jwe: Jwe;
    protected: ProtectedHeader;
    apv: Uint8Array;
    apu?: Uint8Array;
    constructor(options: {
        jwe: Jwe;
        protected: ProtectedHeader;
        apv: Uint8Array;
        apu?: Uint8Array;
    });
    verifyDidComm(): Promise<boolean>;
    decrypt<CE extends {
        decrypt: (options: {
            buf: Uint8Array;
            nonce: Uint8Array;
            aad: Uint8Array;
        }) => Uint8Array;
    }, KW extends {
        unwrapKey: (param: any) => CE;
    }, KDF extends typeof Kdf, KE extends X25519KeyPair | P256KeyPair, KES extends typeof X25519KeyPair | typeof P256KeyPair>({ kdf, ke, sender, recipient, }: {
        kdf: KDF;
        ke: KES;
        sender?: {
            id: string;
            keyExchange: KE;
        };
        recipient: {
            id: string;
            keyExchange: KE;
        };
    }): Promise<Uint8Array>;
}

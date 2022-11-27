import { ParsedJWE } from './ParsedJWE';
import { Recipient } from './envelope';
export declare class Jwe {
    protected: string;
    recipients: Array<Recipient>;
    iv: string;
    ciphertext: string;
    tag: string;
    constructor(options: {
        protected: string;
        recipients: Array<Recipient>;
        iv: string;
        ciphertext: string;
        tag: string;
    });
    static fromString(s: string): Jwe;
    parse(): ParsedJWE;
}

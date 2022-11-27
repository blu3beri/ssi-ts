import { Signature } from './envelope';
import { ParsedJWS } from './ParsedJWS';
export declare class JWS {
    signatures: Array<Signature>;
    payload: string;
    constructor(options: {
        signatures: Array<Signature>;
        payload: string;
    });
    static fromString(s: string): JWS;
    parse(): ParsedJWS;
}

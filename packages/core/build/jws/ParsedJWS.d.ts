import { ProtectedHeader } from './envelope';
import { JWS } from './JWS';
export declare class ParsedJWS {
    jws: JWS;
    protected: Array<ProtectedHeader>;
    constructor(options: {
        jws: JWS;
        protected: Array<ProtectedHeader>;
    });
}

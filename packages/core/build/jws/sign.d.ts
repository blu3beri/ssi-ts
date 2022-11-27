import { JwsAlgorithm } from './envelope';
import { SignatureType } from '../utils';
export declare type Signer = {
    sign(input: Uint8Array, signatureType?: SignatureType): Promise<Uint8Array>;
};
export declare const sign: ({ payload, alg, signer, }: {
    payload: Uint8Array;
    signer: {
        kid: string;
        signer: Signer;
    };
    alg: JwsAlgorithm;
}) => Promise<string>;
export declare const signCompact: ({ typ, signer, payload, alg, }: {
    payload: Uint8Array;
    signer: {
        kid: string;
        signer: Signer;
    };
    typ: string;
    alg: JwsAlgorithm;
}) => Promise<string>;

import { SignatureType } from '../utils';
export declare type Signature = {
    header: Header;
    protected: string;
    signature: string;
};
export declare type ProtectedHeader = {
    typ: string;
    alg: JwsAlgorithm;
};
export declare type Header = {
    kid: string;
};
export declare type CompactHeader = {
    typ: string;
    alg: JwsAlgorithm;
    kid: string;
};
export declare enum JwsAlgorithm {
    EdDSA = "EdDSA",
    'Es256' = "ES256",
    'Es256K' = "ES256K"
}
export declare const JWSAlgorithmToSignatureType: (jwsAlgorithm: JwsAlgorithm) => SignatureType;

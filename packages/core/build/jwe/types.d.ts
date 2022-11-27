export declare type ProtectedHeader = {
    typ?: string;
    alg: JWEAlgorithm;
    enc: EncAlgorithm;
    skid?: string;
    apu?: string;
    apv: string;
    epk: Record<string, unknown>;
};
export declare type Recipient = {
    header: PerRecipientHeader;
    encryptedKey: string;
};
declare type PerRecipientHeader = {
    kid: string;
};
export declare enum JWEAlgorithm {
    Ecdh1puA256Kw = "ECDH-1PU+A256KW",
    EcdhEsA256Kw = "ECDH-ES+A256KW"
}
export declare enum EncAlgorithm {
    A256cbcHs512 = "A256CBC-HS512",
    Xc20P = "XC20P",
    A256Gcm = "A256GCM"
}
export {};

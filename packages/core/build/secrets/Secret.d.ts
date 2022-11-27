import { Ed25519KeyPair, K256KeyPair, KnownKeyAlgorithm, P256KeyPair, X25519KeyPair } from '../crypto';
export declare class Secret {
    id: string;
    type: SecretType;
    secretMaterial: SecretMaterial | SecretMaterial<string>;
    constructor({ id, type, secretMaterial, }: {
        id: string;
        type: SecretType;
        secretMaterial: SecretMaterial | SecretMaterial<string>;
    });
    keyAlgorithm(): KnownKeyAlgorithm;
    asKeyPair(): Promise<X25519KeyPair | K256KeyPair | P256KeyPair | Ed25519KeyPair>;
}
export declare enum SecretType {
    JsonWebKey2020 = 0,
    X25519KeyAgreementKey2019 = 1,
    X25519KeyAgreementKey2020 = 2,
    Ed25519VerificationKey2018 = 3,
    Ed25519VerificationKey2020 = 4,
    EcdsaSecp256k1verificationKey2019 = 5
}
export declare enum SecretMaterialType {
    Jwk = "JWK",
    Multibase = "Multibase",
    Base58 = "base58",
    Hex = "Hex",
    Other = "Other"
}
export declare type SecretMaterial<V = Record<string, unknown>> = {
    type: SecretMaterialType;
    value: V;
};

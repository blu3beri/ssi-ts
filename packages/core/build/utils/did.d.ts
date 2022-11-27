export declare const isDid: (did: string) => boolean;
export declare const didOrUrl: (didOrUrl: string) => {
    did?: string;
    didUrl?: string;
};
export declare enum Codec {
    X25519Pub = 236,
    Ed25519pub = 237,
    X25519Priv = 4866,
    Ed25519Priv = 4608
}

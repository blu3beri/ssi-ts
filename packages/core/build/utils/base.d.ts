export declare class b58 {
    static encode(b: Uint8Array): string;
    static decode(s: string): Uint8Array;
}
export declare class b64 {
    static encode(b: Uint8Array): string;
    static decode(s: string): Uint8Array;
}
export declare class b64UrlSafe {
    static encode(b: Uint8Array | string): string;
    static decode(s: string | Uint8Array): Uint8Array;
}

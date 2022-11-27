import { AnonCryptAlgorithm } from '../../algorithms';
export declare const anoncrypt: ({ to, message, encAlgAnon, }: {
    to: string;
    message: Uint8Array;
    encAlgAnon: AnonCryptAlgorithm;
}) => Promise<{
    message: string;
    toKids: Array<string>;
} | undefined>;

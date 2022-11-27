import { AnonCryptAlgorithm, AuthCryptAlgorithm } from '../../algorithms';
export declare const authcrypt: ({ to, from, message, encAlgAnon, encAlgAuth, protectedSender, }: {
    to: string;
    from: string;
    message: Uint8Array;
    encAlgAuth: AuthCryptAlgorithm;
    encAlgAnon: AnonCryptAlgorithm;
    protectedSender: boolean;
}) => Promise<{
    message: string;
    fromKid: string;
    toKids: Array<string>;
}>;

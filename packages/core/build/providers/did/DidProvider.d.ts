import { DIDDocument } from '../../did/DIDDocument';
export declare type DidProvider = {
    resolve?: (did: string) => Promise<DIDDocument | undefined>;
};

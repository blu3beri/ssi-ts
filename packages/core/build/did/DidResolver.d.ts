import { DIDDocument } from './DidDocument';
export declare class DidResolver {
    static resolve(did: string): Promise<DIDDocument | undefined>;
}

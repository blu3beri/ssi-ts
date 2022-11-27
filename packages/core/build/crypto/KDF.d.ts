import { JweAlgorithm } from '../jwe';
export declare class Kdf {
    static deriveKey<KE, KW>(options: {
        ephemeralKey: KE;
        senderKey?: KE;
        recipientKey: KE;
        alg: JweAlgorithm;
        apu: Uint8Array;
        apv: Uint8Array;
        ccTag: Uint8Array;
        receive: boolean;
    }): KW;
}

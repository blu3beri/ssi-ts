import { AnonCryptAlgorithm, AuthCryptAlgorithm } from '../algorithms';
export declare type PackEncryptedOptions = {
    protectSender: boolean;
    forward: boolean;
    forwardHeaders?: Record<string, unknown>;
    messagingService?: string;
    encAlgAuth: AuthCryptAlgorithm;
    encAlgAnon: AnonCryptAlgorithm;
};
export declare type MessagingServiceMetadata = {
    id: string;
    serviceEndpoint: string;
};

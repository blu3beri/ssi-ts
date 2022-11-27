import type { PackSignedMetadata } from './PackSignedMetadata';
import { Attachment } from './attachment';
import { UnpackMetadata, UnpackOptions } from './unpack';
export declare type TMessage = {
    id: string;
    typ?: 'application/didcomm-plain+json';
    type: string;
    body: Record<string, unknown>;
    from?: string;
    to?: Array<string>;
    thid?: string;
    pthid?: string;
    extraHeaders?: Record<string, unknown>;
    createdTime?: number;
    expiresTime?: number;
    fromPrior?: string;
    attachments?: Array<Attachment>;
};
export declare class Message {
    id: string;
    typ: 'application/didcomm-plain+json';
    type: string;
    body: Record<string, unknown>;
    from?: string;
    to?: Array<string>;
    thid?: string;
    pthid?: string;
    extraHeaders?: Record<string, unknown>;
    createdTime?: number;
    expiresTime?: number;
    fromPrior?: string;
    attachments?: Array<Attachment>;
    constructor(options: TMessage);
    fromString(s: string): Message;
    packPlaintext(): Promise<string>;
    private validatePackPlaintext;
    packSigned(signBy: string): Promise<{
        message: string;
        packSignedMetadata: PackSignedMetadata;
    }>;
    private assertPackSigned;
    private tryUnwrapForwardedMessage;
    unpack({ message, options, }: {
        message: string;
        options: UnpackOptions;
    }): Promise<{
        message: Message;
        metadata: UnpackMetadata;
    }>;
}

import { ServiceEndpoint } from '../did';
import { Message } from '../message';
import { ParsedForward } from './ParsedForward';
import { AnonCryptAlgorithm } from '../algorithms';
import { MessagingServiceMetadata, PackEncryptedOptions } from '../message/PackEncryptedOptions';
export declare const generateMessageId: (<T extends ArrayLike<number>>(options: import("uuid").V4Options | null | undefined, buffer: T, offset?: number | undefined) => T) & ((options?: import("uuid").V4Options | undefined) => string);
export declare const findDidcommService: ({ did, serviceId, }: {
    did: string;
    serviceId?: string | undefined;
}) => Promise<{
    serviceId: string;
    service: ServiceEndpoint;
} | undefined>;
export declare const resolveDidCommServicesChain: ({ to, serviceId, }: {
    to: string;
    serviceId?: string | undefined;
}) => Promise<{
    serviceId: string;
    service: ServiceEndpoint;
}[]>;
export declare const buildForwardMessage: ({ next, forwardMessage, headers, }: {
    forwardMessage: string;
    next: string;
    headers?: Record<string, unknown> | undefined;
}) => string;
export declare const tryParseForward: (message: Message) => ParsedForward | undefined;
export declare const wrapInForward: ({ message, headers, to, encAlgAnon, routingKeys, }: {
    message: string;
    headers?: Record<string, unknown> | undefined;
    to: string;
    routingKeys: Array<string>;
    encAlgAnon: AnonCryptAlgorithm;
}) => Promise<string>;
export declare const wrapInForwardIfNeeded: ({ to, message, options, }: {
    message: string;
    to: string;
    options: PackEncryptedOptions;
}) => Promise<{
    metadata: MessagingServiceMetadata;
    forwardMessage: string;
} | undefined>;

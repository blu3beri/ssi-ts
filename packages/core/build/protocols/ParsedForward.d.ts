import { Message } from '../message';
export declare type ParsedForward = {
    message: Message;
    next: string;
    forwardedMessage: Record<string, unknown>;
};

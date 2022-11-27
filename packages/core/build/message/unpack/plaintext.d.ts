import { Message } from '../Message';
import { UnpackMetadata } from './UnpackMetadata';
export declare const tryUnpackPlaintext: ({}: {
    message: string;
    metadata: UnpackMetadata;
}) => Promise<Message | undefined>;

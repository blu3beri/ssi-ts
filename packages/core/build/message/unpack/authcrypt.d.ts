import { UnpackMetadata } from './UnpackMetadata';
import { UnpackOptions } from './UnpackOptions';
export declare const tryUnpackAuthcrypt: ({ message, options, metadata, }: {
    message: string;
    options: UnpackOptions;
    metadata: UnpackMetadata;
}) => Promise<string | undefined>;

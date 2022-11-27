import { UnpackMetadata } from './UnpackMetadata';
import { UnpackOptions } from './UnpackOptions';
export declare const tryUnpackAnoncrypt: ({ message, options, metadata, }: {
    message: string;
    options: UnpackOptions;
    metadata: UnpackMetadata;
}) => Promise<undefined | string>;

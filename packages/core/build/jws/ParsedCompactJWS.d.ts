import { CompactHeader } from './envelope';
export declare class ParsedCompactJWS {
    header: string;
    parsedHeader: CompactHeader;
    payload: string;
    signature: string;
    constructor(options: {
        header: string;
        parsedHeader: CompactHeader;
        payload: string;
        signature: string;
    });
    static parseCompact(compactJws: string): ParsedCompactJWS;
}

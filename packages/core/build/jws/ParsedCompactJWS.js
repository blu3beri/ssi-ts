"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ParsedCompactJWS = void 0;
const error_1 = require("../error");
const utils_1 = require("../utils");
const buffer_1 = require("buffer");
class ParsedCompactJWS {
    constructor(options) {
        this.header = options.header;
        this.parsedHeader = options.parsedHeader;
        this.payload = options.payload;
        this.signature = options.signature;
    }
    static parseCompact(compactJws) {
        const segments = compactJws.split('.');
        if (segments.length !== 3) {
            throw new error_1.DIDCommError('unable to parse compactly serialized JWS');
        }
        const header = segments[0];
        const payload = segments[1];
        const signature = segments[2];
        const decoded = utils_1.b64UrlSafe.decode(header);
        const parsedHeader = JSON.parse(buffer_1.Buffer.from(decoded).toString());
        return new ParsedCompactJWS({ signature, payload, parsedHeader, header });
    }
}
exports.ParsedCompactJWS = ParsedCompactJWS;
//# sourceMappingURL=ParsedCompactJWS.js.map
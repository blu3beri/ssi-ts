"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JWS = void 0;
const utils_1 = require("../utils");
const ParsedJWS_1 = require("./ParsedJWS");
const buffer_1 = require("buffer");
class JWS {
    constructor(options) {
        this.signatures = options.signatures;
        this.payload = options.payload;
    }
    static fromString(s) {
        const parsed = JSON.parse(s);
        return new JWS(parsed);
    }
    parse() {
        const protectedHeaders = [];
        this.signatures.forEach((s) => {
            const decoded = utils_1.b64UrlSafe.decode(s.protected);
            const p = JSON.parse(buffer_1.Buffer.from(decoded).toString());
            protectedHeaders.push(p);
        });
        return new ParsedJWS_1.ParsedJWS({ jws: this, protected: protectedHeaders });
    }
}
exports.JWS = JWS;
//# sourceMappingURL=JWS.js.map
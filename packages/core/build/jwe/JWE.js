"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Jwe = void 0;
const ParsedJWE_1 = require("./ParsedJWE");
const utils_1 = require("../utils");
const buffer_1 = require("buffer");
class Jwe {
    constructor(options) {
        this.protected = options.protected;
        this.recipients = options.recipients;
        this.iv = options.iv;
        this.ciphertext = options.ciphertext;
        this.tag = options.tag;
    }
    static fromString(s) {
        const parsed = JSON.parse(s);
        return new Jwe(parsed);
    }
    parse() {
        const parsed = utils_1.b64UrlSafe.decode(this.protected);
        const protectedHeader = JSON.parse(buffer_1.Buffer.from(parsed).toString());
        const apv = utils_1.b64UrlSafe.decode(protectedHeader.apv);
        const apu = protectedHeader.apu ? utils_1.b64UrlSafe.decode(protectedHeader.apu) : undefined;
        return new ParsedJWE_1.ParsedJWE({ jwe: this, apu, protected: protectedHeader, apv });
    }
}
exports.Jwe = Jwe;
//# sourceMappingURL=JWE.js.map
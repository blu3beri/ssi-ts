"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.b64UrlSafe = exports.b64 = exports.b58 = void 0;
const bs58_1 = __importDefault(require("bs58"));
const buffer_1 = require("buffer");
class b58 {
    static encode(b) {
        return bs58_1.default.encode(b);
    }
    static decode(s) {
        return bs58_1.default.decode(s);
    }
}
exports.b58 = b58;
class b64 {
    static encode(b) {
        return buffer_1.Buffer.from(b).toString('base64');
    }
    static decode(s) {
        return buffer_1.Buffer.from(s, 'base64');
    }
}
exports.b64 = b64;
class b64UrlSafe {
    static encode(b) {
        const buf = typeof b === 'string' ? buffer_1.Buffer.from(b, 'utf-8') : buffer_1.Buffer.from(b);
        return buf.toString('base64url');
    }
    static decode(s) {
        const y = s instanceof Uint8Array ? s.toString() : s;
        return buffer_1.Buffer.from(y, 'base64url');
    }
}
exports.b64UrlSafe = b64UrlSafe;
//# sourceMappingURL=base.js.map
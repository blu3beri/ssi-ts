"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.KeyPair = void 0;
const error_1 = require("../error");
class KeyPair {
    constructor({ publicKey, privateKey }) {
        this.publicKey = publicKey;
        this.privateKey = privateKey;
    }
    static fromJwkJson(_) {
        throw new error_1.DIDCommError(`fromJwkJson not implemented on base class`);
    }
    static fromSecretBytes(_) {
        throw new error_1.DIDCommError(`fromSecretBytes not implemented on base class`);
    }
}
exports.KeyPair = KeyPair;
//# sourceMappingURL=KeyPair.js.map
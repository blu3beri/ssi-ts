"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.X25519KeyPair = void 0;
const providers_1 = require("../providers");
const KeyPair_1 = require("./KeyPair");
class X25519KeyPair extends KeyPair_1.KeyPair {
    async sign(message) {
        (0, providers_1.assertCryptoProvider)(['x25519']);
        return await providers_1.cryptoProvider.x25519.sign(message);
    }
    static async fromJwkJson(jwk) {
        (0, providers_1.assertCryptoProvider)(['x25519']);
        return await providers_1.cryptoProvider.x25519.fromJwkJson(jwk);
    }
    static async fromSecretBytes(secretBytes) {
        (0, providers_1.assertCryptoProvider)(['x25519']);
        return await providers_1.cryptoProvider.x25519.fromSecretBytes(secretBytes);
    }
}
exports.X25519KeyPair = X25519KeyPair;
//# sourceMappingURL=X25519KeyPair.js.map
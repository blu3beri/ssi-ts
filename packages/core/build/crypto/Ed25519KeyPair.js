"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Ed25519KeyPair = void 0;
const KeyPair_1 = require("./KeyPair");
const providers_1 = require("../providers");
class Ed25519KeyPair extends KeyPair_1.KeyPair {
    async sign(message) {
        (0, providers_1.assertCryptoProvider)(['ed25519']);
        return await providers_1.cryptoProvider.ed25519.sign(message);
    }
    static async fromJwkJson(jwk) {
        (0, providers_1.assertCryptoProvider)(['ed25519']);
        return await providers_1.cryptoProvider.ed25519.fromJwkJson(jwk);
    }
    static async fromSecretBytes(secretBytes) {
        (0, providers_1.assertCryptoProvider)(['ed25519']);
        return await providers_1.cryptoProvider.ed25519.fromSecretBytes(secretBytes);
    }
}
exports.Ed25519KeyPair = Ed25519KeyPair;
//# sourceMappingURL=Ed25519KeyPair.js.map
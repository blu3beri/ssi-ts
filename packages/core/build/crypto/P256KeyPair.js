"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.P256KeyPair = void 0;
const providers_1 = require("../providers");
const KeyPair_1 = require("./KeyPair");
class P256KeyPair extends KeyPair_1.KeyPair {
    async sign(message) {
        (0, providers_1.assertCryptoProvider)(['p256']);
        return await providers_1.cryptoProvider.p256.sign(message);
    }
    static async fromJwkJson(jwk) {
        (0, providers_1.assertCryptoProvider)(['p256']);
        return await providers_1.cryptoProvider.p256.fromJwkJson(jwk);
    }
    static async fromSecretBytes(secretBytes) {
        (0, providers_1.assertCryptoProvider)(['p256']);
        return await providers_1.cryptoProvider.p256.fromSecretBytes(secretBytes);
    }
}
exports.P256KeyPair = P256KeyPair;
//# sourceMappingURL=P256KeyPair.js.map
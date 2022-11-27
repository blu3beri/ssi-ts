"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.K256KeyPair = void 0;
const providers_1 = require("../providers");
const KeyPair_1 = require("./KeyPair");
class K256KeyPair extends KeyPair_1.KeyPair {
    async sign(message) {
        (0, providers_1.assertCryptoProvider)(['k256']);
        return await providers_1.cryptoProvider.k256.sign(message);
    }
    static async fromJwkJson(jwk) {
        (0, providers_1.assertCryptoProvider)(['k256']);
        return await providers_1.cryptoProvider.k256.fromJwkJson(jwk);
    }
    static async fromSecretBytes(secretBytes) {
        (0, providers_1.assertCryptoProvider)(['k256']);
        return await providers_1.cryptoProvider.k256.fromSecretBytes(secretBytes);
    }
}
exports.K256KeyPair = K256KeyPair;
//# sourceMappingURL=K256KeyPair.js.map
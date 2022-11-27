"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Sha256 = void 0;
const providers_1 = require("../providers");
class Sha256 {
    static async hash(message) {
        (0, providers_1.assertCryptoProvider)(['sha256']);
        return providers_1.cryptoProvider.sha256.hash(message);
    }
}
exports.Sha256 = Sha256;
//# sourceMappingURL=Sha256.js.map
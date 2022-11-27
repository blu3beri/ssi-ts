"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setCryptoProvider = exports.assertCryptoProvider = exports.cryptoProvider = void 0;
const utils_1 = require("../utils");
const assertCryptoProvider = (fields) => (0, utils_1.assertProvider)(fields, exports.cryptoProvider);
exports.assertCryptoProvider = assertCryptoProvider;
const setCryptoProvider = (provider) => {
    exports.cryptoProvider = provider;
};
exports.setCryptoProvider = setCryptoProvider;
//# sourceMappingURL=provider.js.map
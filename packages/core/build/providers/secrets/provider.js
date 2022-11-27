"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setSecretsProvider = exports.assertSecretsProvider = exports.secretsProvider = void 0;
const utils_1 = require("../utils");
const assertSecretsProvider = (fields) => (0, utils_1.assertProvider)(fields, exports.secretsProvider);
exports.assertSecretsProvider = assertSecretsProvider;
const setSecretsProvider = (provider) => {
    exports.secretsProvider = provider;
};
exports.setSecretsProvider = setSecretsProvider;
//# sourceMappingURL=provider.js.map
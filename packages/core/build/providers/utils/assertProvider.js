"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.assertProvider = void 0;
const error_1 = require("../../error");
const assertProvider = (fields, provider) => {
    const isValid = provider && fields.every((f) => provider[f]);
    if (!isValid) {
        throw new error_1.DIDCommError(`No functionality found for ${fields} on provider`);
    }
};
exports.assertProvider = assertProvider;
//# sourceMappingURL=assertProvider.js.map
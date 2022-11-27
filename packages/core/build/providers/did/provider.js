"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setDidProvider = exports.assertDidProvider = exports.didProvider = void 0;
const utils_1 = require("../utils");
const assertDidProvider = (fields) => (0, utils_1.assertProvider)(fields, exports.didProvider);
exports.assertDidProvider = assertDidProvider;
const setDidProvider = (provider) => {
    exports.didProvider = provider;
};
exports.setDidProvider = setDidProvider;
//# sourceMappingURL=provider.js.map
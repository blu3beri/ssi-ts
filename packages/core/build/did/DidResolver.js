"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DidResolver = void 0;
const providers_1 = require("../providers");
class DidResolver {
    static async resolve(did) {
        (0, providers_1.assertDidProvider)(['resolve']);
        return providers_1.didProvider.resolve(did);
    }
}
exports.DidResolver = DidResolver;
//# sourceMappingURL=DidResolver.js.map
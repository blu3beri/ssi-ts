"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Secrets = void 0;
const providers_1 = require("../providers");
class Secrets {
    static async findSecrets(secretIds) {
        (0, providers_1.assertSecretsProvider)(['findSecrets']);
        return providers_1.secretsProvider.findSecrets(secretIds);
    }
    static async getSecret(secretId) {
        (0, providers_1.assertSecretsProvider)(['getSecret']);
        return providers_1.secretsProvider.getSecret(secretId);
    }
}
exports.Secrets = Secrets;
//# sourceMappingURL=Secrets.js.map
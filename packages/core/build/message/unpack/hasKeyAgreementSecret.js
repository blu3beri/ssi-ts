"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.hasKeyAgreementSecret = void 0;
const did_1 = require("../../did");
const error_1 = require("../../error");
const providers_1 = require("../../providers");
const utils_1 = require("../../utils");
const hasKeyAgreementSecret = async ({ didOrKid }) => {
    (0, providers_1.assertSecretsProvider)(['findSecrets']);
    const { didUrl: kid, did } = (0, utils_1.didOrUrl)(didOrKid);
    if (!did)
        throw new error_1.DIDCommError('did not found');
    const kids = [];
    if (kid) {
        kids.push(kid);
    }
    else {
        const didDoc = await did_1.DidResolver.resolve(did);
        if (!didDoc)
            throw new error_1.DIDCommError('Next did doc not found');
        if (!didDoc.keyAgreement)
            throw new error_1.DIDCommError('No key agreements found');
        kids.push(...didDoc.keyAgreement.map((k) => (typeof k === 'string' ? k : k.id)));
    }
    const secretIds = await providers_1.secretsProvider.findSecrets(kids);
    return secretIds.length > 0;
};
exports.hasKeyAgreementSecret = hasKeyAgreementSecret;
//# sourceMappingURL=hasKeyAgreementSecret.js.map
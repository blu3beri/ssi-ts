"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.anoncrypt = void 0;
const did_1 = require("../../did");
const error_1 = require("../../error");
const providers_1 = require("../../providers");
const utils_1 = require("../../utils");
const anoncrypt = async ({ to, message, encAlgAnon, }) => {
    (0, providers_1.assertDidProvider)(['resolve']);
    const { did: toDid, didUrl: toKid } = (0, utils_1.didOrUrl)(to);
    if (!toDid)
        throw new error_1.DIDCommError('no did in `to` found');
    const toDidDoc = await did_1.DidResolver.resolve(toDid);
    if (!toDidDoc)
        throw new error_1.DIDCommError(`No DID Document found for ${toDid}`);
    if (!toDidDoc.keyAgreement) {
        throw new error_1.DIDCommError(`No keyAgreement found in ${toDidDoc}`);
    }
    const toKids = toDidDoc.keyAgreement.filter((k) => (toKid ? (typeof k === 'string' ? k : k.id) === toKid : true));
    if (toKids.length === 0) {
        throw new error_1.DIDCommError('No matching key agreements found');
    }
    const toKeys = toKids.map((kid) => {
        var _a;
        const method = (_a = toDidDoc.verificationMethod) === null || _a === void 0 ? void 0 : _a.find((v) => v.id === (typeof kid === 'string' ? kid : kid.id));
        if (!method) {
            throw new error_1.DIDCommError('External keys are not supported in this version');
        }
        return method;
    });
    // TODO: incorrect filter here
    const keyAlg = toKeys
        .filter((k) => k.type === 'JsonWebKey2020' ||
        k.type === 'X25519KeyAgreement2019' ||
        k.type === 'X25519KeyAgreementKey2020' ||
        k.type === 'Ed25519VerificationKey2018' ||
        k.type === 'Ed25519VerificationKey2020' ||
        k.type === 'EcdsaSecp256k1VerificationKey2019')
        .map((k) => k.type)[0];
    if (!keyAlg)
        throw new error_1.DIDCommError('No key agreements found for recipient');
    const tKeys = toKeys.filter((k) => k.type === keyAlg);
    // TODO: create message
    // HERE
    // let to_kids: Vec<_> = to_keys.into_iter().map(|vm| vm.id.clone()).collect();
    // Ok((msg, to_kids))
    const tooooKids = tKeys.map((vm) => vm.id);
    return { message: 'TODO: message', toKids: tooooKids };
};
exports.anoncrypt = anoncrypt;
//# sourceMappingURL=anoncrypt.js.map
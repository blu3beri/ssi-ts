"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.tryUnpackSign = void 0;
const did_1 = require("../../did");
const error_1 = require("../../error");
const jws_1 = require("../../jws");
const providers_1 = require("../../providers");
const utils_1 = require("../../utils");
const buffer_1 = require("buffer");
const tryUnpackSign = async ({ message, metadata, }) => {
    var _a, _b;
    (0, providers_1.assertDidProvider)(['resolve']);
    const jws = jws_1.JWS.fromString(message);
    const parsedJws = jws.parse();
    if (parsedJws.protected.length !== 1) {
        throw new error_1.DIDCommError('Wrong amount of signatures for jws');
    }
    let algorithm = parsedJws.protected[0].alg;
    if (!algorithm) {
        throw new error_1.DIDCommError('Unexpected absence of first protected header');
    }
    const signerKidFromHeader = parsedJws.jws.signatures[0].header.kid;
    if (!signerKidFromHeader) {
        throw new error_1.DIDCommError('Unexpected absence of first signature');
    }
    const { did: signerDid, didUrl: signerUrl } = (0, utils_1.didOrUrl)(signerKidFromHeader);
    if (!signerUrl || !signerDid) {
        throw new error_1.DIDCommError('Signer key can not be resolved to key agreement');
    }
    const signerDidDocument = await did_1.DidResolver.resolve(signerDid);
    if (!signerDidDocument) {
        throw new error_1.DIDCommError('Signer did not found');
    }
    const signerKid = (_a = signerDidDocument.authentication) === null || _a === void 0 ? void 0 : _a.find((k) => typeof k !== 'string' ? k.id : k === signerKid);
    if (!signerKid) {
        throw new error_1.DIDCommError('Signer kid not found in did');
    }
    const signerKidString = typeof signerKid === 'string' ? signerKid : signerKid.id;
    const signerKey = (_b = signerDidDocument.verificationMethod) === null || _b === void 0 ? void 0 : _b.find((v) => v.id === signerKidString);
    if (!signerKey) {
        throw new error_1.DIDCommError('Sender key not found in did');
    }
    // TODO
    const valid = true;
    if (!valid) {
        throw new error_1.DIDCommError('Wrong signature');
    }
    const payload = utils_1.b64UrlSafe.decode(parsedJws.jws.payload);
    const serializedPayload = buffer_1.Buffer.from(payload).toString('utf-8');
    metadata.authenticated = true;
    metadata.nonRepudiation = true;
    metadata.signFrom = signerKidString;
    metadata.signedMessage = message;
    return serializedPayload;
};
exports.tryUnpackSign = tryUnpackSign;
//# sourceMappingURL=sign.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.signCompact = exports.sign = void 0;
const envelope_1 = require("./envelope");
const utils_1 = require("../utils");
const buffer_1 = require("buffer");
const JWS_1 = require("./JWS");
const sign = async ({ payload, alg, signer, }) => {
    const { signer: key, kid } = signer;
    const sigType = (0, envelope_1.JWSAlgorithmToSignatureType)(alg);
    const protectedHeader = {
        alg,
        typ: 'application/didcomm-signed+json',
    };
    const serializedProtected = JSON.stringify(protectedHeader);
    const encodedProtected = utils_1.b64UrlSafe.encode(serializedProtected);
    const encodedPayload = utils_1.b64UrlSafe.encode(payload);
    const signInput = `${encodedProtected}.${encodedPayload}`;
    const signatureBytes = await key.sign(Uint8Array.from(buffer_1.Buffer.from(signInput)), sigType);
    const encodedSignature = utils_1.b64UrlSafe.encode(signatureBytes);
    const signature = {
        header: { kid },
        protected: encodedProtected,
        signature: encodedSignature,
    };
    const jws = new JWS_1.JWS({
        payload: encodedPayload,
        signatures: [signature],
    });
    return JSON.stringify(jws);
};
exports.sign = sign;
const signCompact = async ({ typ, signer, payload, alg, }) => {
    const { signer: key, kid } = signer;
    const sigType = (0, envelope_1.JWSAlgorithmToSignatureType)(alg);
    const compactHeader = { alg, typ, kid };
    const header = JSON.stringify(compactHeader);
    const encodedHeader = utils_1.b64UrlSafe.encode(header);
    const encodedPayload = utils_1.b64UrlSafe.encode(payload);
    const signInput = `${encodedHeader}.${encodedPayload}`;
    const signature = await key.sign(Uint8Array.from(buffer_1.Buffer.from(signInput)), sigType);
    const encodedSignature = utils_1.b64UrlSafe.encode(signature);
    return `${encodedHeader}.${encodedSignature}.${encodedSignature}`;
};
exports.signCompact = signCompact;
//# sourceMappingURL=sign.js.map
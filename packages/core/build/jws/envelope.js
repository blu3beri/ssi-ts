"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JWSAlgorithmToSignatureType = exports.JwsAlgorithm = void 0;
const error_1 = require("../error");
const utils_1 = require("../utils");
var JwsAlgorithm;
(function (JwsAlgorithm) {
    JwsAlgorithm["EdDSA"] = "EdDSA";
    JwsAlgorithm["Es256"] = "ES256";
    JwsAlgorithm["Es256K"] = "ES256K";
})(JwsAlgorithm = exports.JwsAlgorithm || (exports.JwsAlgorithm = {}));
const JWSAlgorithmToSignatureType = (jwsAlgorithm) => {
    switch (jwsAlgorithm) {
        case JwsAlgorithm.EdDSA:
            return utils_1.SignatureType.EdDSA;
        case JwsAlgorithm.Es256:
            return utils_1.SignatureType.ES256;
        case JwsAlgorithm.Es256K:
            return utils_1.SignatureType.ES256K;
        default:
            throw new error_1.DIDCommError(`Unsupported signature type: ${jwsAlgorithm}`);
    }
};
exports.JWSAlgorithmToSignatureType = JWSAlgorithmToSignatureType;
//# sourceMappingURL=envelope.js.map
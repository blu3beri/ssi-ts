"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SigningAlgorithm = exports.AuthCryptAlgorithm = exports.AnonCryptAlgorithm = void 0;
var AnonCryptAlgorithm;
(function (AnonCryptAlgorithm) {
    AnonCryptAlgorithm[AnonCryptAlgorithm["A256cbcHs512EcdhEsA256kw"] = 0] = "A256cbcHs512EcdhEsA256kw";
    AnonCryptAlgorithm[AnonCryptAlgorithm["Xc20pEcdhEsA256kw"] = 1] = "Xc20pEcdhEsA256kw";
    AnonCryptAlgorithm[AnonCryptAlgorithm["A256gcmEcdhEsA256kw"] = 2] = "A256gcmEcdhEsA256kw";
})(AnonCryptAlgorithm = exports.AnonCryptAlgorithm || (exports.AnonCryptAlgorithm = {}));
var AuthCryptAlgorithm;
(function (AuthCryptAlgorithm) {
    AuthCryptAlgorithm[AuthCryptAlgorithm["A256cbcHs512Ecdh1puA256kw"] = 0] = "A256cbcHs512Ecdh1puA256kw";
})(AuthCryptAlgorithm = exports.AuthCryptAlgorithm || (exports.AuthCryptAlgorithm = {}));
var SigningAlgorithm;
(function (SigningAlgorithm) {
    SigningAlgorithm[SigningAlgorithm["EdDSA"] = 0] = "EdDSA";
    SigningAlgorithm[SigningAlgorithm["ES256"] = 1] = "ES256";
    SigningAlgorithm[SigningAlgorithm["ES256K"] = 2] = "ES256K";
})(SigningAlgorithm = exports.SigningAlgorithm || (exports.SigningAlgorithm = {}));
//# sourceMappingURL=algorithms.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EncAlgorithm = exports.JWEAlgorithm = void 0;
var JWEAlgorithm;
(function (JWEAlgorithm) {
    JWEAlgorithm["Ecdh1puA256Kw"] = "ECDH-1PU+A256KW";
    JWEAlgorithm["EcdhEsA256Kw"] = "ECDH-ES+A256KW";
})(JWEAlgorithm = exports.JWEAlgorithm || (exports.JWEAlgorithm = {}));
var EncAlgorithm;
(function (EncAlgorithm) {
    EncAlgorithm["A256cbcHs512"] = "A256CBC-HS512";
    EncAlgorithm["Xc20P"] = "XC20P";
    EncAlgorithm["A256Gcm"] = "A256GCM";
})(EncAlgorithm = exports.EncAlgorithm || (exports.EncAlgorithm = {}));
//# sourceMappingURL=types.js.map
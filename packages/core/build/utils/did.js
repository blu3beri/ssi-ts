"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Codec = exports.didOrUrl = exports.isDid = void 0;
const isDid = (did) => {
    const parts = did.split(':');
    return parts.length >= 3 && parts[0] === 'did';
};
exports.isDid = isDid;
const didOrUrl = (didOrUrl) => {
    if (!(0, exports.isDid)(didOrUrl))
        return {};
    const parts = didOrUrl.split('#');
    return {
        did: parts[0],
        didUrl: parts[1],
    };
};
exports.didOrUrl = didOrUrl;
var Codec;
(function (Codec) {
    Codec[Codec["X25519Pub"] = 236] = "X25519Pub";
    Codec[Codec["Ed25519pub"] = 237] = "Ed25519pub";
    Codec[Codec["X25519Priv"] = 4866] = "X25519Priv";
    Codec[Codec["Ed25519Priv"] = 4608] = "Ed25519Priv";
})(Codec = exports.Codec || (exports.Codec = {}));
//# sourceMappingURL=did.js.map
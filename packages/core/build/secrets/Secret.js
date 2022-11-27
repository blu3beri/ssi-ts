"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SecretMaterialType = exports.SecretType = exports.Secret = void 0;
const bs58_1 = __importDefault(require("bs58"));
const crypto_1 = require("../crypto");
const error_1 = require("../error");
const utils_1 = require("../utils/");
class Secret {
    constructor({ id, type, secretMaterial, }) {
        this.id = id;
        this.type = type;
        this.secretMaterial = secretMaterial;
    }
    keyAlgorithm() {
        if (this.type === SecretType.JsonWebKey2020 && this.secretMaterial.type === 'JWK') {
            const kty = this.secretMaterial.value.kty;
            const crv = this.secretMaterial.value.crv;
            if (!kty || !crv)
                return crypto_1.KnownKeyAlgorithm.Unsupported;
            if (kty === 'EC') {
                if (crv === 'P-256')
                    return crypto_1.KnownKeyAlgorithm.P256;
                if (crv === 'secp256k1')
                    return crypto_1.KnownKeyAlgorithm.P256;
            }
            if (kty === 'OKP') {
                if (crv === 'Ed25519')
                    return crypto_1.KnownKeyAlgorithm.Ed25519;
                if (crv === 'X25519')
                    return crypto_1.KnownKeyAlgorithm.X25519;
            }
        }
        if (this.type === SecretType.X25519KeyAgreementKey2019 && this.secretMaterial.type === SecretMaterialType.Base58) {
            return crypto_1.KnownKeyAlgorithm.X25519;
        }
        if (this.type === SecretType.Ed25519VerificationKey2018 &&
            this.secretMaterial.type === SecretMaterialType.Multibase) {
            return crypto_1.KnownKeyAlgorithm.Ed25519;
        }
        if (this.type === SecretType.X25519KeyAgreementKey2020 &&
            this.secretMaterial.type === SecretMaterialType.Multibase) {
            return crypto_1.KnownKeyAlgorithm.X25519;
        }
        if (this.type === SecretType.Ed25519VerificationKey2020 &&
            this.secretMaterial.type === SecretMaterialType.Multibase) {
            return crypto_1.KnownKeyAlgorithm.Ed25519;
        }
        return crypto_1.KnownKeyAlgorithm.Unsupported;
    }
    async asKeyPair() {
        const value = this.secretMaterial.value;
        if (this.type === SecretType.JsonWebKey2020 && this.secretMaterial.type === SecretMaterialType.Jwk) {
            const kty = value.kty;
            const crv = value.crv;
            if (kty === 'EC') {
                if (crv === 'P-256')
                    return crypto_1.P256KeyPair.fromJwkJson(value);
                if (crv === 'secp256k1')
                    return crypto_1.K256KeyPair.fromJwkJson(value);
            }
            if (kty === 'OKP') {
                if (crv === 'Ed25519')
                    return crypto_1.Ed25519KeyPair.fromJwkJson(value);
                if (crv === 'X25519')
                    return crypto_1.X25519KeyPair.fromJwkJson(value);
            }
            throw new error_1.DIDCommError(`Unsupported key type or curve.`);
        }
        if (this.type === SecretType.X25519KeyAgreementKey2019 && this.secretMaterial.type === SecretMaterialType.Base58) {
            const decodedValue = utils_1.b58.decode(this.secretMaterial.value);
            const keyPair = await crypto_1.X25519KeyPair.fromSecretBytes(decodedValue);
            const jwk = {
                kty: 'OKP',
                crv: 'X25519',
                x: utils_1.b64UrlSafe.encode(keyPair.publicKey),
                d: keyPair.privateKey ? utils_1.b64UrlSafe.encode(keyPair.privateKey) : undefined,
            };
            return crypto_1.X25519KeyPair.fromJwkJson(jwk);
        }
        if (this.type === SecretType.Ed25519VerificationKey2018 && this.secretMaterial.type === SecretMaterialType.Base58) {
            const decodedValue = utils_1.b58.decode(this.secretMaterial.value);
            const curve25519PointSize = 32;
            const dValue = decodedValue.slice(0, curve25519PointSize);
            const xValue = decodedValue.slice(curve25519PointSize, 0);
            const jwk = {
                crv: 'Ed25519',
                x: utils_1.b64UrlSafe.encode(xValue),
                d: utils_1.b64UrlSafe.encode(dValue),
            };
            return crypto_1.Ed25519KeyPair.fromJwkJson(jwk);
        }
        if (this.type === SecretType.X25519KeyAgreementKey2020 &&
            this.secretMaterial.type === SecretMaterialType.Multibase) {
            const value = this.secretMaterial.value;
            if (!value.startsWith('z')) {
                throw new error_1.DIDCommError("Multibase must start with 'z'");
            }
            const decodedMultibaseValue = utils_1.b58.decode(value.slice(1));
            // TODO: implement from multicodec properly
            const fromMulticodec = () => ({
                codec: utils_1.Codec.X25519Priv,
                decodedValue: new Uint8Array([1, 2, 4]),
            });
            const { codec, decodedValue } = fromMulticodec();
            if (codec !== utils_1.Codec.X25519Priv) {
                throw new error_1.DIDCommError(`wrong codec in multibase secret material. Expected ${utils_1.Codec.X25519Priv}, got ${codec}`);
            }
            const keyPair = await crypto_1.X25519KeyPair.fromSecretBytes(decodedValue);
            const jwk = {
                kty: 'OKP',
                crv: 'X25519',
                x: utils_1.b64UrlSafe.encode(keyPair.publicKey),
                d: keyPair.privateKey ? utils_1.b64UrlSafe.encode(keyPair.privateKey) : undefined,
            };
            return crypto_1.X25519KeyPair.fromJwkJson(jwk);
        }
        if (this.type === SecretType.Ed25519VerificationKey2020 &&
            // TODO: why this this incorrect?
            this.secretMaterial.type === SecretMaterialType.Multibase) {
            const value = this.secretMaterial.value;
            if (!value.startsWith('z')) {
                throw new error_1.DIDCommError("Multibase must start with 'z'");
            }
            const decodedMultibaseValue = bs58_1.default.decode(value.slice(1));
            // TODO: implement from multicodec properly
            const fromMulticodec = () => ({
                codec: utils_1.Codec.Ed25519Priv,
                decodedValue: new Uint8Array([1, 2, 4]),
            });
            const { codec, decodedValue } = fromMulticodec();
            if (codec !== utils_1.Codec.Ed25519Priv) {
                throw new error_1.DIDCommError(`wrong codec in multibase secret material. Expected ${utils_1.Codec.Ed25519Priv}, got ${codec}`);
            }
            const keyPair = await crypto_1.Ed25519KeyPair.fromSecretBytes(decodedValue);
            const jwk = {
                kty: 'OKP',
                crv: 'Ed25519',
                x: utils_1.b64UrlSafe.encode(keyPair.publicKey),
                d: keyPair.privateKey ? utils_1.b64UrlSafe.encode(keyPair.privateKey) : undefined,
            };
            return crypto_1.Ed25519KeyPair.fromJwkJson(jwk);
        }
        throw new error_1.DIDCommError('Unsupported secret method and material combination');
    }
}
exports.Secret = Secret;
var SecretType;
(function (SecretType) {
    SecretType[SecretType["JsonWebKey2020"] = 0] = "JsonWebKey2020";
    SecretType[SecretType["X25519KeyAgreementKey2019"] = 1] = "X25519KeyAgreementKey2019";
    SecretType[SecretType["X25519KeyAgreementKey2020"] = 2] = "X25519KeyAgreementKey2020";
    SecretType[SecretType["Ed25519VerificationKey2018"] = 3] = "Ed25519VerificationKey2018";
    SecretType[SecretType["Ed25519VerificationKey2020"] = 4] = "Ed25519VerificationKey2020";
    SecretType[SecretType["EcdsaSecp256k1verificationKey2019"] = 5] = "EcdsaSecp256k1verificationKey2019";
})(SecretType = exports.SecretType || (exports.SecretType = {}));
var SecretMaterialType;
(function (SecretMaterialType) {
    SecretMaterialType["Jwk"] = "JWK";
    SecretMaterialType["Multibase"] = "Multibase";
    SecretMaterialType["Base58"] = "base58";
    SecretMaterialType["Hex"] = "Hex";
    SecretMaterialType["Other"] = "Other";
})(SecretMaterialType = exports.SecretMaterialType || (exports.SecretMaterialType = {}));
//# sourceMappingURL=Secret.js.map
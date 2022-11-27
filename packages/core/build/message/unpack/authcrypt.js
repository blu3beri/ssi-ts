"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.tryUnpackAuthcrypt = void 0;
const error_1 = require("../../error");
const jwe_1 = require("../../jwe");
const buffer_1 = require("buffer");
const utils_1 = require("../../utils");
const providers_1 = require("../../providers");
const crypto_1 = require("../../crypto");
const algorithms_1 = require("../../algorithms");
const tryUnpackAuthcrypt = async ({ message, options, metadata, }) => {
    var _a, _b, _c;
    (0, providers_1.assertDidProvider)(['resolve']);
    (0, providers_1.assertSecretsProvider)(['findSecrets', 'getSecret']);
    const jwe = jwe_1.Jwe.fromString(message);
    if (!jwe)
        throw new error_1.DIDCommError('Invalid JWE message');
    const parsedJwe = jwe.parse();
    if (parsedJwe.protected.alg !== jwe_1.JweAlgorithm.Ecdh1puA256Kw)
        return undefined;
    if (!parsedJwe.verifyDidComm())
        return undefined;
    if (!parsedJwe.apu)
        throw new error_1.DIDCommError('No apu present for authcrypt');
    const fromKid = buffer_1.Buffer.from(parsedJwe.apu).toString('utf-8');
    const { did: fromDid, didUrl: fromUrl } = (0, utils_1.didOrUrl)(fromKid);
    if (!fromDid) {
        throw new error_1.DIDCommError('Apu does not contain did');
    }
    if (!fromUrl) {
        throw new error_1.DIDCommError('Sender key can not be resolved to key agreement');
    }
    const fromDidDoc = await providers_1.didProvider.resolve(fromDid);
    if (!fromDidDoc)
        throw new error_1.DIDCommError('Unable to resolve sender did');
    const fromKidDidDoc = (_a = fromDidDoc.keyAgreement) === null || _a === void 0 ? void 0 : _a.find((k) => k === fromKid);
    if (!fromKidDidDoc)
        throw new error_1.DIDCommError('Sender kid not found in did');
    // TODO: implement asKeyPair on VerificationMethod
    const fromKey = (_b = fromDidDoc.verificationMethod) === null || _b === void 0 ? void 0 : _b.find((v) => v.id === fromKidDidDoc);
    if (!fromKey) {
        throw new error_1.DIDCommError('Sender verification method not found in did');
    }
    const toKids = parsedJwe.jwe.recipients.map((r) => r.header.kid);
    const toKid = toKids[0];
    if (!toKid)
        throw new error_1.DIDCommError('No recipient keys found');
    const { did: toDid } = (0, utils_1.didOrUrl)(toKid);
    if (!toDid)
        throw new error_1.DIDCommError(`Could not get did from first recipient header kid: ${toKid}`);
    // TODO: not 100% sure if this is the correct implementation
    const unableToResolveAll = toKids.some((k) => {
        const { did: kDid, didUrl: kUrl } = (0, utils_1.didOrUrl)(k);
        return kDid !== toDid || !!kUrl;
    });
    if (unableToResolveAll) {
        throw new error_1.DIDCommError('Recipient keys are outside of one did or can not be resolved to key agreement');
    }
    if (!metadata.encryptedToKids) {
        metadata.encryptedToKids = toKids;
    }
    else {
        // TODO: Verify that same keys used for authcrypt as for anoncrypt envelope
    }
    metadata.authenticated = true;
    metadata.encrypted = true;
    metadata.encryptedFromKid = fromKid;
    const toKidsFound = await providers_1.secretsProvider.findSecrets(toKids);
    if (toKids.length === 0) {
        throw new error_1.DIDCommError('No recipient secrets found');
    }
    let payload;
    for (const toKid in toKidsFound) {
        const toKey = await ((_c = (await providers_1.secretsProvider.getSecret(toKid))) === null || _c === void 0 ? void 0 : _c.asKeyPair());
        if (!toKey) {
            throw new error_1.DIDCommError('Recipient secret not found after existence checking');
        }
        let _payload;
        if (fromKey instanceof crypto_1.X25519KeyPair &&
            toKey instanceof crypto_1.X25519KeyPair &&
            parsedJwe.protected.enc === jwe_1.EncAlgorithm.A256cbcHs512) {
            metadata.encAlgAuth = algorithms_1.AuthCryptAlgorithm.A256cbcHs512Ecdh1puA256kw;
            _payload = await parsedJwe.decrypt({
                sender: { id: fromKid, keyExchange: fromKey },
                recipient: { id: toKid, keyExchange: toKey },
                // TODO: likely incorrect KDF here
                kdf: crypto_1.Kdf,
                ke: crypto_1.X25519KeyPair,
            });
        }
        else if (fromKey instanceof crypto_1.P256KeyPair &&
            toKey instanceof crypto_1.P256KeyPair &&
            parsedJwe.protected.enc === jwe_1.EncAlgorithm.A256cbcHs512) {
            metadata.encAlgAuth = algorithms_1.AuthCryptAlgorithm.A256cbcHs512Ecdh1puA256kw;
            _payload = await parsedJwe.decrypt({
                sender: { id: fromKid, keyExchange: fromKey },
                recipient: { id: toKid, keyExchange: toKey },
                // TODO: likely incorrect KDF here
                kdf: crypto_1.Kdf,
                ke: crypto_1.P256KeyPair,
            });
        }
        else {
            throw new error_1.DIDCommError(`Incompatible sender and recipient key agreement curves, or unsupported key agreement method. Curves: ${{
                sender: fromKey,
                recipient: toKey,
                protectedEnc: parsedJwe.protected.enc,
            }}`);
        }
        payload = _payload;
        if (!options.expectDecryptByAllKeys)
            break;
    }
    if (!payload) {
        throw new error_1.DIDCommError('No payload created');
    }
    return buffer_1.Buffer.from(payload).toString('utf-8');
};
exports.tryUnpackAuthcrypt = tryUnpackAuthcrypt;
//# sourceMappingURL=authcrypt.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.tryUnpackAnoncrypt = void 0;
const error_1 = require("../../error");
const jwe_1 = require("../../jwe");
const providers_1 = require("../../providers");
const utils_1 = require("../../utils");
const buffer_1 = require("buffer");
const crypto_1 = require("../../crypto");
const secrets_1 = require("../../secrets");
const tryUnpackAnoncrypt = async ({ message, options, metadata, }) => {
    var _a;
    (0, providers_1.assertSecretsProvider)(['getSecret', 'findSecrets']);
    const jwe = jwe_1.Jwe.fromString(message);
    if (!jwe)
        return undefined;
    const parsedJwe = jwe.parse();
    if (parsedJwe.protected.alg !== jwe_1.JweAlgorithm.EcdhEsA256Kw) {
        return undefined;
    }
    if (!parsedJwe.verifyDidComm()) {
        throw new error_1.DIDCommError('Unable to verify parsed JWE');
    }
    const toKids = parsedJwe.jwe.recipients.map((r) => r.header.kid);
    const toKid = toKids[0];
    if (!toKid) {
        throw new error_1.DIDCommError('No recipient keys found');
    }
    const { did: toDid } = (0, utils_1.didOrUrl)(toKid);
    if (!toDid) {
        throw new error_1.DIDCommError('Unable to convert toKid to did');
    }
    if (!toKids.find((k) => {
        const { did, didUrl } = (0, utils_1.didOrUrl)(k);
        return did !== toDid || !didUrl;
    })) {
        throw new error_1.DIDCommError('Recipient keys are outside of one did or can not be resolver to key agreement');
    }
    metadata.encryptedToKids = toKids;
    metadata.encrypted = true;
    metadata.anonymousSender = true;
    const toKidsFound = await secrets_1.Secrets.findSecrets(toKids);
    if (toKidsFound.length === 0) {
        throw new error_1.DIDCommError('No recipient secrets found');
    }
    let payload;
    for (const toKid of toKidsFound) {
        const toKey = (_a = (await secrets_1.Secrets.getSecret(toKid))) === null || _a === void 0 ? void 0 : _a.asKeyPair();
        if (!toKey) {
            throw new error_1.DIDCommError('Recipient secret not found after existence checking');
        }
        // TODO: finish this implementation for all the algorithms and keypair types
        if (toKey instanceof crypto_1.X25519KeyPair) {
            payload = await parsedJwe.decrypt({
                recipient: { id: toKid, keyExchange: toKey },
                ke: crypto_1.X25519KeyPair,
                kdf: crypto_1.Kdf,
            });
        }
        else if (toKey instanceof crypto_1.P256KeyPair) {
        }
        else {
            throw new error_1.DIDCommError('Could not find the instance of toKey');
        }
        if (options.expectDecryptByAllKeys) {
            break;
        }
    }
    if (!payload)
        throw new error_1.DIDCommError('Could not establish payload');
    const serializedPayload = buffer_1.Buffer.from(payload).toString('utf-8');
    return serializedPayload;
};
exports.tryUnpackAnoncrypt = tryUnpackAnoncrypt;
//# sourceMappingURL=anoncrypt.js.map
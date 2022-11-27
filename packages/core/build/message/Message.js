"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Message = void 0;
const fromPrior_1 = require("./fromPrior");
const error_1 = require("../error");
const utils_1 = require("../utils");
const jws_1 = require("../jws");
const buffer_1 = require("buffer");
const unpack_1 = require("./unpack");
const routing_1 = require("../protocols/routing");
const providers_1 = require("../providers");
const crypto_1 = require("../crypto");
const secrets_1 = require("../secrets");
const did_1 = require("../did");
class Message {
    constructor(options) {
        this.id = options.id;
        this.typ = 'application/didcomm-plain+json';
        this.type = options.type;
        this.body = options.body;
        this.from = options.from;
        this.to = options.to;
        this.thid = options.thid;
        this.pthid = options.pthid;
        this.extraHeaders = options.extraHeaders;
        this.createdTime = options.createdTime;
        this.expiresTime = options.expiresTime;
        this.fromPrior = options.fromPrior;
        this.attachments = options.attachments;
    }
    fromString(s) {
        const obj = JSON.parse(s);
        if (!obj.id || !obj.type || !obj.body) {
            throw new error_1.DIDCommError(`string: ${s} does not contain either: 'id', 'type' or 'body'`);
        }
        return new Message(JSON.parse(s));
    }
    async packPlaintext() {
        let kid;
        let fromPrior;
        if (this.fromPrior) {
            const res = await fromPrior_1.FromPrior.unpack({
                fromPriorJwt: this.fromPrior,
            });
            kid = res.kid;
            fromPrior = res.fromPrior;
        }
        this.validatePackPlaintext(fromPrior, kid);
        // TODO: does this serialization work like this?
        return JSON.stringify(this);
    }
    validatePackPlaintext(fromPrior, fromPriorIssuerKid) {
        if (fromPrior) {
            fromPrior.validatePack(fromPriorIssuerKid);
            if (this.from && fromPrior.sub !== this.from) {
                throw new error_1.DIDCommError('fromPrior `sub` value is not equal to message `from` value');
            }
        }
    }
    async packSigned(signBy) {
        (0, providers_1.assertDidProvider)(['resolve']);
        (0, providers_1.assertSecretsProvider)(['findSecrets', 'getSecret']);
        this.assertPackSigned(signBy);
        const { did, didUrl } = (0, utils_1.didOrUrl)(signBy);
        if (!did)
            throw new error_1.DIDCommError('Could not get did from `signBy` field');
        const didDoc = await did_1.DidResolver.resolve(did);
        if (!didDoc) {
            throw new error_1.DIDCommError('Unable to resolve signer DID');
        }
        if (!didDoc.authentication) {
            throw new error_1.DIDCommError('Authentication field not found on did document');
        }
        const authentications = [];
        if (didUrl) {
            if (!didDoc.authentication.find((a) => a === didUrl)) {
                throw new error_1.DIDCommError('Signer key id not found in did doc authentication field');
            }
            authentications.push(didUrl);
        }
        else {
            didDoc.authentication.forEach((a) => authentications.push(typeof a === 'string' ? a : a.id));
        }
        const keyId = (await secrets_1.Secrets.findSecrets(authentications))[0];
        if (!keyId) {
            throw new error_1.DIDCommError(`Could not resolve secrets for ${authentications}`);
        }
        const secret = await secrets_1.Secrets.getSecret(keyId);
        if (!secret) {
            throw new error_1.DIDCommError(`Could not find signer secret for ${keyId}`);
        }
        const signKey = await secret.asKeyPair();
        const payload = await this.packPlaintext();
        const algorithm = signKey instanceof crypto_1.Ed25519KeyPair
            ? jws_1.JwsAlgorithm.EdDSA
            : signKey instanceof crypto_1.P256KeyPair
                ? jws_1.JwsAlgorithm.Es256
                : signKey instanceof crypto_1.K256KeyPair
                    ? jws_1.JwsAlgorithm.Es256K
                    : undefined;
        if (!algorithm)
            throw new error_1.DIDCommError(`Unsupported signature algorithm ${signKey}`);
        const message = await (0, jws_1.sign)({
            payload: buffer_1.Buffer.from(payload),
            alg: algorithm,
            // TODO: all the keypairs should implement keySign
            signer: { kid: keyId, signer: signKey },
        });
        return {
            message,
            packSignedMetadata: { signByKid: keyId },
        };
    }
    assertPackSigned(signBy) {
        if (!(0, utils_1.isDid)(signBy)) {
            throw new error_1.DIDCommError('`sign_from` value is not a valid DID or DID URL');
        }
    }
    async tryUnwrapForwardedMessage({ message }) {
        let plaintext;
        try {
            plaintext = this.fromString(message);
        }
        catch (_a) {
            return undefined;
        }
        const parsedForward = (0, routing_1.tryParseForward)(plaintext);
        if (!parsedForward)
            return undefined;
        if (await (0, unpack_1.hasKeyAgreementSecret)({
            didOrKid: parsedForward.next,
        })) {
            return JSON.stringify(parsedForward.forwardedMessage);
        }
    }
    async unpack({ message, options, }) {
        const metadata = {
            encrypted: false,
            authenticated: false,
            nonRepudiation: false,
            anonymousSender: false,
            reWrappedInForward: false,
        };
        let msg = message;
        let anoncrypted;
        let forwardedMessage;
        while (true) {
            anoncrypted = await (0, unpack_1.tryUnpackAnoncrypt)({
                message: msg,
                options,
                metadata,
            });
            if (options.unwrapReWrappingForward && anoncrypted) {
                const forwardMessageOptions = await this.tryUnwrapForwardedMessage({
                    message: anoncrypted,
                });
                if (forwardMessageOptions) {
                    forwardedMessage = forwardMessageOptions;
                    msg = forwardedMessage;
                    metadata.reWrappedInForward = true;
                    continue;
                }
            }
            break;
        }
        msg = anoncrypted !== null && anoncrypted !== void 0 ? anoncrypted : msg;
        const authcrypted = await (0, unpack_1.tryUnpackAuthcrypt)({
            message: msg,
            metadata,
            options,
        });
        msg = authcrypted !== null && authcrypted !== void 0 ? authcrypted : msg;
        const signed = await (0, unpack_1.tryUnpackSign)({ message: msg, metadata });
        msg = signed !== null && signed !== void 0 ? signed : msg;
        const plaintext = await (0, unpack_1.tryUnpackPlaintext)({
            message: msg,
            metadata,
        });
        if (!plaintext) {
            throw new error_1.DIDCommError('Message is not a valid JWE, JWS or JWM');
        }
        return { message: plaintext, metadata };
    }
}
exports.Message = Message;
//# sourceMappingURL=Message.js.map
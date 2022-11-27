"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FromPrior = void 0;
const error_1 = require("../error");
const jws_1 = require("../jws");
const utils_1 = require("../utils");
const buffer_1 = require("buffer");
const providers_1 = require("../providers");
const secrets_1 = require("../secrets");
const did_1 = require("../did");
class FromPrior {
    constructor({ iss, sub, aud, exp, iat, jti, nbf, }) {
        this.iss = iss;
        this.sub = sub;
        this.aud = aud;
        this.exp = exp;
        this.nbf = nbf;
        this.iat = iat;
        this.jti = jti;
    }
    static fromString(s) {
        const parsed = JSON.parse(s);
        return new FromPrior(parsed);
    }
    async pack({ issuerKid }) {
        var _a, _b;
        (0, providers_1.assertDidProvider)(['resolve']);
        (0, providers_1.assertSecretsProvider)(['findSecrets', 'getSecret']);
        this.validatePack(issuerKid);
        const fromPriorString = JSON.stringify(this);
        const didDoc = await did_1.DidResolver.resolve(this.iss);
        if (!didDoc)
            throw new error_1.DIDCommError('Unable to resolve issuer DID');
        const authenticationKids = [];
        if (!didDoc.authentication) {
            throw new error_1.DIDCommError('Authentication field not found in did doc');
        }
        if (issuerKid) {
            const { did, didUrl: kid } = (0, utils_1.didOrUrl)(issuerKid);
            if (!kid)
                throw new error_1.DIDCommError('issuerKid content is not a DID URL');
            if (did !== this.iss) {
                throw new error_1.DIDCommError('issuerKid does not belong to `iss`');
            }
            const authKid = (_a = didDoc.authentication) === null || _a === void 0 ? void 0 : _a.find((a) => a === kid);
            if (!authKid) {
                throw new error_1.DIDCommError('provided issuerKid is not found in DIDDoc');
            }
            authenticationKids.push(typeof authKid === 'string' ? authKid : authKid.id);
        }
        else {
            (_b = didDoc.authentication) === null || _b === void 0 ? void 0 : _b.forEach((a) => authenticationKids.push(typeof a === 'string' ? a : a.id));
        }
        const kid = (await secrets_1.Secrets.findSecrets(authenticationKids))[0];
        if (!kid)
            throw new error_1.DIDCommError('No issuer secrets found');
        const secret = await secrets_1.Secrets.getSecret(kid);
        if (!secret)
            throw new error_1.DIDCommError('Unable to find secret for issuer');
        const signKeyPair = await secret.asKeyPair();
        const fromPriorJwt = await (0, jws_1.signCompact)({
            payload: buffer_1.Buffer.from(fromPriorString),
            signer: { kid, signer: signKeyPair },
            typ: 'JWT',
            // TODO: also map es256k and es256
            alg: jws_1.JwsAlgorithm.EdDSA,
        });
        return { fromPriorJwt, kid: JSON.stringify(kid) };
    }
    validatePack(issuerKid) {
        if (!(0, utils_1.isDid)(this.iss) || (0, utils_1.didOrUrl)(this.iss).didUrl) {
            throw new error_1.DIDCommError('`iss` must be a non-fragment DID');
        }
        if (!(0, utils_1.isDid)(this.sub) || (0, utils_1.didOrUrl)(this.sub).didUrl) {
            throw new error_1.DIDCommError('`sub` must be a non-fragment DID');
        }
        if (this.iss === this.sub) {
            throw new error_1.DIDCommError('`sub` and `iss` must not be equal');
        }
        if (issuerKid) {
            const { didUrl: kid, did } = (0, utils_1.didOrUrl)(issuerKid);
            if (!kid)
                throw new error_1.DIDCommError('issuerKid content is not a DID URL');
            if (did !== this.iss) {
                throw new error_1.DIDCommError('issuerKid does not belong to `iss`');
            }
        }
        return true;
    }
    static async unpack({ fromPriorJwt, }) {
        var _a;
        (0, providers_1.assertDidProvider)(['resolve']);
        const parsed = jws_1.ParsedCompactJWS.parseCompact(fromPriorJwt);
        const typ = parsed.parsedHeader.typ;
        const alg = parsed.parsedHeader.alg;
        const kid = parsed.parsedHeader.kid;
        if (typ !== 'JWT') {
            throw new error_1.DIDCommError('fromPrior is malformed: typ is not JWT');
        }
        const { did, didUrl } = (0, utils_1.didOrUrl)(kid);
        if (!did)
            throw new error_1.DIDCommError('DID not fround from kid');
        if (!didUrl)
            throw new error_1.DIDCommError('fromPrior kid is not DID URL');
        const didDoc = await did_1.DidResolver.resolve(did);
        if (!didDoc)
            throw new error_1.DIDCommError('fromPrior issuer DIDDoc not found');
        if (!didDoc.authentication) {
            throw new error_1.DIDCommError('authentication field not found in did doc');
        }
        const kidFromDidDoc = (_a = didDoc.authentication) === null || _a === void 0 ? void 0 : _a.find((a) => a === kid);
        if (!kidFromDidDoc) {
            throw new error_1.DIDCommError('fromPrior issuer kid not found in DIDDoc');
        }
        if (!didDoc.verificationMethod) {
            throw new error_1.DIDCommError('authentication field not found in did doc');
        }
        const key = didDoc.verificationMethod.find((v) => v.id === kid);
        if (!key) {
            throw new error_1.DIDCommError('fromPrior issuer verification method not found in DIDDoc');
        }
        const valid = false;
        switch (alg) {
            case jws_1.JwsAlgorithm.EdDSA:
                // TODO
                break;
            case jws_1.JwsAlgorithm.Es256:
                // TODO
                break;
            case jws_1.JwsAlgorithm.Es256K:
                // TODO
                break;
            default:
                throw new error_1.DIDCommError(`Unsuppored signature algorithm. ${alg}`);
        }
        if (!valid)
            throw new error_1.DIDCommError('wrong fromPrior signature');
        const payload = utils_1.b64UrlSafe.decode(parsed.payload);
        const deserializedPayload = buffer_1.Buffer.from(payload).toString();
        const fromPrior = FromPrior.fromString(deserializedPayload);
        return { fromPrior, kid };
    }
}
exports.FromPrior = FromPrior;
//# sourceMappingURL=FromPrior.js.map
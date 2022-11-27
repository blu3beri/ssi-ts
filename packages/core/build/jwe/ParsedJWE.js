"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ParsedJWE = void 0;
const error_1 = require("../error");
const buffer_1 = require("buffer");
const providers_1 = require("../providers");
const utils_1 = require("../utils");
const crypto_1 = require("../crypto");
class ParsedJWE {
    constructor(options) {
        this.jwe = options.jwe;
        this.protected = options.protected;
        this.apv = options.apv;
        this.apu = options.apu;
    }
    async verifyDidComm() {
        (0, providers_1.assertCryptoProvider)(['sha256']);
        // TODO: verify the sorting
        const kids = this.jwe.recipients.map((r) => r.header.kid).sort();
        const didCommApv = await crypto_1.Sha256.hash(Uint8Array.from(buffer_1.Buffer.from(kids.join('.'))));
        if (this.apv !== didCommApv)
            throw new error_1.DIDCommError('APV Mismatch');
        const didCommApu = this.apu ? buffer_1.Buffer.from(this.apu).toString('utf-8') : undefined;
        if (this.protected.skid && didCommApu && didCommApu.length > 0) {
            if (didCommApu !== this.protected.skid) {
                throw new error_1.DIDCommError('APU mismatch');
            }
        }
        if (this.protected.skid && didCommApu) {
            throw new error_1.DIDCommError('SKID present, but no apu');
        }
        return true;
    }
    async decrypt({ kdf, ke, sender, recipient, }) {
        var _a, _b;
        const { id: sKid, keyExchange: sKey } = sender !== null && sender !== void 0 ? sender : {};
        const { id: kid, keyExchange: key } = recipient;
        if (sKid ? buffer_1.Buffer.from(sKid) : undefined !== this.apu) {
            throw new error_1.DIDCommError('wrong sender key id used');
        }
        const encodedEncryptedKey = (_a = this.jwe.recipients.find((r) => r.header.kid === kid)) === null || _a === void 0 ? void 0 : _a.encryptedKey;
        if (!encodedEncryptedKey) {
            throw new error_1.DIDCommError('Recipient not found');
        }
        const encryptedKey = utils_1.b64UrlSafe.decode(encodedEncryptedKey);
        const epk = (await ke.fromJwkJson(this.protected.epk));
        const tag = utils_1.b64UrlSafe.decode(this.jwe.tag);
        const kw = kdf.deriveKey({
            ephemeralKey: epk,
            senderKey: sKey,
            recipientKey: key,
            alg: this.protected.alg,
            apu: (_b = this.apu) !== null && _b !== void 0 ? _b : new Uint8Array(0),
            apv: this.apv,
            ccTag: tag,
            receive: true,
        });
        if (!kw) {
            throw new error_1.DIDCommError('Unable to derive kw');
        }
        const cek = kw.unwrapKey(encryptedKey);
        if (!cek) {
            throw new error_1.DIDCommError('unable to unwrap cek');
        }
        const cipherText = utils_1.b64UrlSafe.decode(this.jwe.ciphertext);
        const iv = utils_1.b64UrlSafe.decode(this.jwe.iv);
        const buf = new Uint8Array([...cipherText, ...tag]);
        const plaintext = cek.decrypt({
            buf,
            nonce: iv,
            aad: Uint8Array.from(buffer_1.Buffer.from(this.jwe.protected)),
        });
        return plaintext;
    }
}
exports.ParsedJWE = ParsedJWE;
//# sourceMappingURL=ParsedJWE.js.map
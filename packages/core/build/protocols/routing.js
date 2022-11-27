"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.wrapInForwardIfNeeded = exports.wrapInForward = exports.tryParseForward = exports.buildForwardMessage = exports.resolveDidCommServicesChain = exports.findDidcommService = exports.generateMessageId = void 0;
const did_1 = require("../did");
const error_1 = require("../error");
const utils_1 = require("../utils");
const uuid_1 = require("uuid");
const message_1 = require("../message");
const buffer_1 = require("buffer");
const providers_1 = require("../providers");
const DIDCOMM_V2_PROFILE = 'didcomm/v2';
const FORWARD_MESSAGE_TYPE = 'https://didcomm.org/routing/2.0/forward';
exports.generateMessageId = uuid_1.v4;
const findDidcommService = async ({ did, serviceId, }) => {
    var _a, _b;
    (0, providers_1.assertDidProvider)(['resolve']);
    const didDoc = await did_1.DidResolver.resolve(did);
    if (!didDoc)
        throw new error_1.DIDCommError('DID not found');
    if (!didDoc.service) {
        throw new error_1.DIDCommError('Service field not found on DIDDoc');
    }
    if (serviceId) {
        const service = didDoc.service.find((s) => s.id === serviceId);
        if (!service) {
            throw new error_1.DIDCommError(`Service with specified ID ${serviceId} not found`);
        }
        if (service.serviceEndpoint) {
            const serviceEndpoint = service.serviceEndpoint;
            if (serviceEndpoint.accept) {
                if (((_a = serviceEndpoint.accept) === null || _a === void 0 ? void 0 : _a.length) === 0 || ((_b = serviceEndpoint.accept) === null || _b === void 0 ? void 0 : _b.includes(DIDCOMM_V2_PROFILE))) {
                    return { serviceId, service: serviceEndpoint };
                }
                else {
                    throw new error_1.DIDCommError('Service with specified ID does not accept didcomm/v2 profile');
                }
            }
            else {
                return { serviceId, service: serviceEndpoint };
            }
        }
        else {
            throw new error_1.DIDCommError('Service with specified ID is not of correct type ');
        }
    }
    else {
        didDoc.service.find((service) => {
            if (service.serviceEndpoint) {
                const serviceEndpoint = service.serviceEndpoint;
                if (serviceEndpoint.accept) {
                    if (serviceEndpoint.accept.length === 0 || serviceEndpoint.accept.includes(DIDCOMM_V2_PROFILE)) {
                        return { sevice: serviceEndpoint, serviceId: service.id };
                    }
                }
                else {
                    return undefined;
                }
            }
            else {
                return undefined;
            }
        });
    }
};
exports.findDidcommService = findDidcommService;
const resolveDidCommServicesChain = async ({ to, serviceId, }) => {
    const { did } = (0, utils_1.didOrUrl)(to);
    if (!did)
        throw new error_1.DIDCommError('Could not get did from to value');
    const maybeService = await (0, exports.findDidcommService)({
        did,
        serviceId,
    });
    if (!maybeService)
        return [];
    const { service } = maybeService;
    const services = [maybeService];
    let serviceEndpoint = service.uri;
    while ((0, utils_1.isDid)(serviceEndpoint)) {
        if (services.length > 1) {
            throw new error_1.DIDCommError('DID doc defines alternative endpoints recursively');
        }
        const s = await (0, exports.findDidcommService)({ did: serviceEndpoint });
        if (!s) {
            throw new error_1.DIDCommError('Referenced mediator does not provide any correct services');
        }
        services.unshift(s);
        serviceEndpoint = s.service.uri;
    }
    return services;
};
exports.resolveDidCommServicesChain = resolveDidCommServicesChain;
const buildForwardMessage = ({ next, forwardMessage, headers, }) => {
    const body = { next };
    const attachment = {
        data: { Json: JSON.parse(forwardMessage) },
    };
    const message = new message_1.Message({
        id: (0, exports.generateMessageId)(),
        type: FORWARD_MESSAGE_TYPE,
        body,
        extraHeaders: headers,
        attachments: [attachment],
    });
    return JSON.stringify(message);
};
exports.buildForwardMessage = buildForwardMessage;
const tryParseForward = (message) => {
    if (message.type !== FORWARD_MESSAGE_TYPE) {
        return undefined;
    }
    const next = message.body.next ? message.body.next : undefined;
    if (!next || typeof next !== 'string') {
        return undefined;
    }
    if (!message.attachments)
        return undefined;
    const attachmentData = message.attachments[0].data.Json;
    if (!attachmentData)
        return undefined;
    return {
        message,
        next,
        forwardedMessage: attachmentData,
    };
};
exports.tryParseForward = tryParseForward;
const wrapInForward = async ({ message, headers, to, encAlgAnon, routingKeys, }) => {
    let tos = routingKeys;
    let nexts = tos;
    nexts.shift();
    nexts.push(to);
    tos = tos.reverse();
    nexts = nexts.reverse();
    let m = message;
    for (let i = 0; i > tos.length; i++) {
        const to = tos[i];
        const next = nexts[i];
        m = (0, exports.buildForwardMessage)({ forwardMessage: m, next, headers });
        const res = await (0, message_1.anoncrypt)({
            to,
            encAlgAnon,
            message: Uint8Array.from(buffer_1.Buffer.from(m)),
        });
        if (!res) {
            throw new error_1.DIDCommError('Could not use anoncrypt');
        }
        m = res.message;
    }
    return m;
};
exports.wrapInForward = wrapInForward;
const wrapInForwardIfNeeded = async ({ to, message, options, }) => {
    var _a;
    if (!options.forward)
        return undefined;
    const serviceChain = await (0, exports.resolveDidCommServicesChain)({
        to,
        serviceId: options.messagingService,
    });
    if (serviceChain.length === 0)
        return undefined;
    const routingKeys = serviceChain.slice(1).map((s) => s.service.uri);
    (_a = serviceChain[serviceChain.length - 1].service.routingKeys) === null || _a === void 0 ? void 0 : _a.forEach((k) => routingKeys.push(k));
    if (routingKeys.length === 0)
        return undefined;
    const forwardMessage = await (0, exports.wrapInForward)({
        message,
        to,
        headers: options.forwardHeaders,
        encAlgAnon: options.encAlgAnon,
        routingKeys,
    });
    const metadata = {
        id: serviceChain[serviceChain.length - 1].serviceId,
        serviceEndpoint: serviceChain[0].service.uri,
    };
    return { forwardMessage, metadata };
};
exports.wrapInForwardIfNeeded = wrapInForwardIfNeeded;
//# sourceMappingURL=routing.js.map
import {
  ServiceEndpoint,
  DIDDocument,
  Service,
  VerificationMethod,
} from '../../did'

const CHARLIE_VERIFICATION_METHOD_KEY_AGREEM_X25519: VerificationMethod = {
  id: 'did:example:charlie#key-x25519-1',
  controller: 'did:example:charlie#key-x25519-1',
  type: 'JsonWebKey2020',
  publicKeyJwk: {
    kty: 'OKP',
    crv: 'X25519',
    x: 'nTiVFj7DChMsETDdxd5dIzLAJbSQ4j4UG6ZU1ogLNlw',
  },
}

const CHARLIE_AUTH_METHOD_25519: VerificationMethod = {
  id: 'did:example:charlie#key-1',
  controller: 'did:example:charlie#key-1',
  type: 'JsonWebKey2020',
  publicKeyJwk: {
    kty: 'OKP',
    crv: 'Ed25519',
    x: 'VDXDwuGKVq91zxU6q7__jLDUq8_C5cuxECgd-1feFTE',
  },
}

const CHARLIE_DID_COMM_MESSAGING_SERVICE: ServiceEndpoint = {
  uri: 'did:example:mediator3',
  accept: ['didcomm/v2', 'didcomm/aip2;env=rfc587'],
  routingKeys: [
    'did:example:mediator2#key-x25519-1',
    'did:example:mediator1#key-x25519-1',
  ],
}

const CHARLIE_SERVICE: Service = {
  id: 'did:example:charlie#didcomm-1',
  type: 'DIDCommMessaging',
  serviceEndpoint: CHARLIE_DID_COMM_MESSAGING_SERVICE,
}

export const CHARLIE_DID_DOC: DIDDocument = {
  id: 'did:example:charlie',
  authentication: ['did:example:charlie#key-1'],
  keyAgreement: ['did:example:charlie#key-x25519-1'],
  service: [CHARLIE_SERVICE],
  verificationMethod: [
    CHARLIE_VERIFICATION_METHOD_KEY_AGREEM_X25519,
    CHARLIE_AUTH_METHOD_25519,
  ],
}

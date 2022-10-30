import {
  DIDCommMessagingService,
  DIDDocument,
  Service,
  VerificationMethod,
} from 'packages/core/src/did'

const BOB_VERIFICATION_METHOD_KEY_AGREEM_X25519_1: VerificationMethod = {
  id: 'did:example:bob#key-x25519-1',
  controller: 'did:example:bob#key-x25519-1',
  type: 'JsonWebKey2020',
  publicKeyJwk: {
    kty: 'OKP',
    crv: 'X25519',
    x: 'GDTrI66K0pFfO54tlCSvfjjNapIs44dzpneBgyx0S3E',
  },
}

const BOB_VERIFICATION_METHOD_KEY_AGREEM_X25519_2: VerificationMethod = {
  id: 'did:example:bob#key-x25519-2',
  controller: 'did:example:bob#key-x25519-2',
  type: 'JsonWebKey2020',
  publicKeyJwk: {
    kty: 'OKP',
    crv: 'X25519',
    x: 'UT9S3F5ep16KSNBBShU2wh3qSfqYjlasZimn0mB8_VM',
  },
}

const BOB_VERIFICATION_METHOD_KEY_AGREEM_X25519_3: VerificationMethod = {
  id: 'did:example:bob#key-x25519-3',
  controller: 'did:example:bob#key-x25519-3',
  type: 'JsonWebKey2020',
  publicKeyJwk: {
    kty: 'OKP',
    crv: 'X25519',
    x: '82k2BTUiywKv49fKLZa-WwDi8RBf0tB0M8bvSAUQ3yY',
  },
}

const BOB_VERIFICATION_METHOD_KEY_AGREEM_X25519_NOT_IN_SECRETS_1: VerificationMethod =
  {
    id: 'did:example:bob#key-x25519-not-secrets-1',
    controller: 'did:example:bob#key-x25519-not-secrets-1',
    type: 'JsonWebKey2020',
    publicKeyJwk: {
      kty: 'OKP',
      crv: 'X25519',
      x: '82k2BTUiywKv49fKLZa-WwDi8RBf0tB0M8bvSAUQ3yY',
    },
  }

const BOB_VERIFICATION_METHOD_KEY_AGREEM_P256_1: VerificationMethod = {
  id: 'did:example:bob#key-p256-1',
  controller: 'did:example:bob#key-p256-1',
  type: 'JsonWebKey2020',
  publicKeyJwk: {
    kty: 'EC',
    crv: 'P-256',
    x: 'FQVaTOksf-XsCUrt4J1L2UGvtWaDwpboVlqbKBY2AIo',
    y: '6XFB9PYo7dyC5ViJSO9uXNYkxTJWn0d_mqJ__ZYhcNY',
  },
}

const BOB_VERIFICATION_METHOD_KEY_AGREEM_P256_2: VerificationMethod = {
  id: 'did:example:bob#key-p256-2',
  controller: 'did:example:bob#key-p256-2',
  type: 'JsonWebKey2020',
  publicKeyJwk: {
    kty: 'EC',
    crv: 'P-256',
    x: 'n0yBsGrwGZup9ywKhzD4KoORGicilzIUyfcXb1CSwe0',
    y: 'ov0buZJ8GHzV128jmCw1CaFbajZoFFmiJDbMrceCXIw',
  },
}

const BOB_VERIFICATION_METHOD_KEY_AGREEM_P256_NOT_IN_SECRETS_1: VerificationMethod =
  {
    id: 'did:example:bob#key-p256-not-secrets-1',
    controller: 'did:example:bob#key-p256-not-secrets-1',
    type: 'JsonWebKey2020',
    publicKeyJwk: {
      kty: 'EC',
      crv: 'P-256',
      x: 'n0yBsGrwGZup9ywKhzD4KoORGicilzIUyfcXb1CSwe0',
      y: 'ov0buZJ8GHzV128jmCw1CaFbajZoFFmiJDbMrceCXIw',
    },
  }

const BOB_VERIFICATION_METHOD_KEY_AGREEM_P384_1: VerificationMethod = {
  id: 'did:example:bob#key-p384-1',
  controller: 'did:example:bob#key-p384-1',
  type: 'JsonWebKey2020',
  publicKeyJwk: {
    kty: 'EC',
    crv: 'P-384',
    x: 'MvnE_OwKoTcJVfHyTX-DLSRhhNwlu5LNoQ5UWD9Jmgtdxp_kpjsMuTTBnxg5RF_Y',
    y: 'X_3HJBcKFQEG35PZbEOBn8u9_z8V1F9V1Kv-Vh0aSzmH-y9aOuDJUE3D4Hvmi5l7',
  },
}

const BOB_VERIFICATION_METHOD_KEY_AGREEM_P384_2: VerificationMethod = {
  id: 'did:example:bob#key-p384-2',
  controller: 'did:example:bob#key-p384-2',
  type: 'JsonWebKey2020',
  publicKeyJwk: {
    kty: 'EC',
    crv: 'P-384',
    x: '2x3HOTvR8e-Tu6U4UqMd1wUWsNXMD0RgIunZTMcZsS-zWOwDgsrhYVHmv3k_DjV3',
    y: 'W9LLaBjlWYcXUxOf6ECSfcXKaC3-K9z4hCoP0PS87Q_4ExMgIwxVCXUEB6nf0GDd',
  },
}

const BOB_VERIFICATION_METHOD_KEY_AGREEM_P384_NOT_IN_SECRETS_1: VerificationMethod =
  {
    id: 'did:example:bob#key-p384-not-secrets-1',
    controller: 'did:example:bob#key-p384-not-secrets-1',
    type: 'JsonWebKey2020',
    publicKeyJwk: {
      kty: 'EC',
      crv: 'P-384',
      x: '2x3HOTvR8e-Tu6U4UqMd1wUWsNXMD0RgIunZTMcZsS-zWOwDgsrhYVHmv3k_DjV3',
      y: 'W9LLaBjlWYcXUxOf6ECSfcXKaC3-K9z4hCoP0PS87Q_4ExMgIwxVCXUEB6nf0GDd',
    },
  }

const BOB_VERIFICATION_METHOD_KEY_AGREEM_P521_1: VerificationMethod = {
  id: 'did:example:bob#key-p521-1',
  controller: 'did:example:bob#key-p521-1',
  type: 'JsonWebKey2020',
  publicKeyJwk: {
    kty: 'EC',
    crv: 'P-521',
    x: 'Af9O5THFENlqQbh2Ehipt1Yf4gAd9RCa3QzPktfcgUIFADMc4kAaYVViTaDOuvVS2vMS1KZe0D5kXedSXPQ3QbHi',
    y: 'ATZVigRQ7UdGsQ9j-omyff6JIeeUv3CBWYsZ0l6x3C_SYqhqVV7dEG-TafCCNiIxs8qeUiXQ8cHWVclqkH4Lo1qH',
  },
}

const BOB_VERIFICATION_METHOD_KEY_AGREEM_P521_2: VerificationMethod = {
  id: 'did:example:bob#key-p521-2',
  controller: 'did:example:bob#key-p521-2',
  type: 'JsonWebKey2020',
  publicKeyJwk: {
    kty: 'EC',
    crv: 'P-521',
    x: 'ATp_WxCfIK_SriBoStmA0QrJc2pUR1djpen0VdpmogtnKxJbitiPq-HJXYXDKriXfVnkrl2i952MsIOMfD2j0Ots',
    y: 'AEJipR0Dc-aBZYDqN51SKHYSWs9hM58SmRY1MxgXANgZrPaq1EeGMGOjkbLMEJtBThdjXhkS5VlXMkF0cYhZELiH',
  },
}

const BOB_VERIFICATION_METHOD_KEY_AGREEM_P521_NOT_IN_SECRETS_1: VerificationMethod =
  {
    id: 'did:example:bob#key-p521-not-secrets-1',
    controller: 'did:example:bob#key-p521-not-secrets-1',
    type: 'JsonWebKey2020',

    publicKeyJwk: {
      kty: 'EC',
      crv: 'P-521',
      x: 'ATp_WxCfIK_SriBoStmA0QrJc2pUR1djpen0VdpmogtnKxJbitiPq-HJXYXDKriXfVnkrl2i952MsIOMfD2j0Ots',
      y: 'AEJipR0Dc-aBZYDqN51SKHYSWs9hM58SmRY1MxgXANgZrPaq1EeGMGOjkbLMEJtBThdjXhkS5VlXMkF0cYhZELiH',
    },
  }

const BOB_DID_COMM_MESSAGING_SERVICE: DIDCommMessagingService = {
  serviceEndpoint: 'http://example.com/path',
  accept: ['didcomm/v2', 'didcomm/api2;env=rfc587'],
  routingKeys: ['did:example:mediator1#key-x25519-1'],
}

const BOB_SERVICE: Service = {
  id: 'did:exaqmple:bob#didcomm-1',
  kind: {
    value: BOB_DID_COMM_MESSAGING_SERVICE,
  },
}

export const BOB_DID_DOC: DIDDocument = {
  id: 'did:example:bob',
  authentication: [],
  keyAgreement: [
    'did:example:bob#key-x25519-1',
    'did:example:bob#key-x25519-2',
    'did:example:bob#key-x25519-3',
    'did:example:bob#key-p256-1',
    'did:example:bob#key-p256-2',
    'did:example:bob#key-p384-1',
    'did:example:bob#key-p384-2',
    'did:example:bob#key-p521-1',
    'did:example:bob#key-p521-2',
  ],
  service: [BOB_SERVICE],
  verificationMethod: [
    BOB_VERIFICATION_METHOD_KEY_AGREEM_X25519_1,
    BOB_VERIFICATION_METHOD_KEY_AGREEM_X25519_2,
    BOB_VERIFICATION_METHOD_KEY_AGREEM_X25519_3,
    BOB_VERIFICATION_METHOD_KEY_AGREEM_P256_1,
    BOB_VERIFICATION_METHOD_KEY_AGREEM_P256_2,
    BOB_VERIFICATION_METHOD_KEY_AGREEM_P384_1,
    BOB_VERIFICATION_METHOD_KEY_AGREEM_P384_2,
    BOB_VERIFICATION_METHOD_KEY_AGREEM_P521_1,
    BOB_VERIFICATION_METHOD_KEY_AGREEM_P521_2,
  ],
}
export const BOB_DID_DOC_NO_SECRETS: DIDDocument = {
  id: 'did:example:bob',
  authentication: [],
  keyAgreement: [
    'did:example:bob#key-x25519-1',
    'did:example:bob#key-x25519-2',
    'did:example:bob#key-x25519-3',
    'did:example:bob#key-x25519-not-secrets-1',
    'did:example:bob#key-p256-1',
    'did:example:bob#key-p256-2',
    'did:example:bob#key-p256-not-secrets-1',
    'did:example:bob#key-p384-1',
    'did:example:bob#key-p384-2',
    'did:example:bob#key-p384-not-secrets-1',
    'did:example:bob#key-p521-1',
    'did:example:bob#key-p521-2',
    'did:example:bob#key-p521-not-secrets-1',
  ],
  service: [BOB_SERVICE],
  verificationMethod: [
    BOB_VERIFICATION_METHOD_KEY_AGREEM_X25519_1,
    BOB_VERIFICATION_METHOD_KEY_AGREEM_X25519_2,
    BOB_VERIFICATION_METHOD_KEY_AGREEM_X25519_3,
    BOB_VERIFICATION_METHOD_KEY_AGREEM_X25519_NOT_IN_SECRETS_1,
    BOB_VERIFICATION_METHOD_KEY_AGREEM_P256_1,
    BOB_VERIFICATION_METHOD_KEY_AGREEM_P256_2,
    BOB_VERIFICATION_METHOD_KEY_AGREEM_P256_NOT_IN_SECRETS_1,
    BOB_VERIFICATION_METHOD_KEY_AGREEM_P384_1,
    BOB_VERIFICATION_METHOD_KEY_AGREEM_P384_2,
    BOB_VERIFICATION_METHOD_KEY_AGREEM_P384_NOT_IN_SECRETS_1,
    BOB_VERIFICATION_METHOD_KEY_AGREEM_P521_1,
    BOB_VERIFICATION_METHOD_KEY_AGREEM_P521_2,
    BOB_VERIFICATION_METHOD_KEY_AGREEM_P521_NOT_IN_SECRETS_1,
  ],
}

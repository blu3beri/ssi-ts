import { Secret, SecretMaterialType, SecretType } from '../../secrets'

export const MEDIATOR1_SECRET_KEY_AGREEMENT_KEY_X25519_1 = new Secret({
  id: 'did:example:mediator1#key-x25519-1',
  type: SecretType.JsonWebKey2020,
  secretMaterial: {
    type: SecretMaterialType.Jwk,
    value: {
      kty: 'OKP',
      d: 'b9NnuOCB0hm7YGNvaE9DMhwH_wjZA1-gWD6dA0JWdL0',
      crv: 'X25519',
      x: 'GDTrI66K0pFfO54tlCSvfjjNapIs44dzpneBgyx0S3E',
    },
  },
})

export const MEDIATOR1_SECRET_KEY_AGREEMENT_KEY_P256_1 = new Secret({
  id: 'did:example:mediator1#key-p256-1',
  type: SecretType.JsonWebKey2020,
  secretMaterial: {
    type: SecretMaterialType.Jwk,
    value: {
      kty: 'EC',
      d: 'PgwHnlXxt8pwR6OCTUwwWx-P51BiLkFZyqHzquKddXQ',
      crv: 'P-256',
      x: 'FQVaTOksf-XsCUrt4J1L2UGvtWaDwpboVlqbKBY2AIo',
      y: '6XFB9PYo7dyC5ViJSO9uXNYkxTJWn0d_mqJ__ZYhcNY',
    },
  },
})

export const MEDIATOR1_SECRET_KEY_AGREEMENT_KEY_P384_1 = new Secret({
  id: 'did:example:mediator1#key-p384-1',
  type: SecretType.JsonWebKey2020,
  secretMaterial: {
    type: SecretMaterialType.Jwk,
    value: {
      kty: 'EC',
      d: 'ajqcWbYA0UDBKfAhkSkeiVjMMt8l-5rcknvEv9t_Os6M8s-HisdywvNCX4CGd_xY',
      crv: 'P-384',
      x: 'MvnE_OwKoTcJVfHyTX-DLSRhhNwlu5LNoQ5UWD9Jmgtdxp_kpjsMuTTBnxg5RF_Y',
      y: 'X_3HJBcKFQEG35PZbEOBn8u9_z8V1F9V1Kv-Vh0aSzmH-y9aOuDJUE3D4Hvmi5l7',
    },
  },
})

export const MEDIATOR1_SECRET_KEY_AGREEMENT_KEY_P521_1 = new Secret({
  id: 'did:example:mediator1#key-p521-1',
  type: SecretType.JsonWebKey2020,
  secretMaterial: {
    type: SecretMaterialType.Jwk,
    value: {
      kty: 'EC',
      d: 'AV5ocjvy7PkPgNrSuvCxtG70NMj6iTabvvjSLbsdd8OdI9HlXYlFR7RdBbgLUTruvaIRhjEAE9gNTH6rWUIdfuj6',
      crv: 'P-521',
      x: 'Af9O5THFENlqQbh2Ehipt1Yf4gAd9RCa3QzPktfcgUIFADMc4kAaYVViTaDOuvVS2vMS1KZe0D5kXedSXPQ3QbHi',
      y: 'ATZVigRQ7UdGsQ9j-omyff6JIeeUv3CBWYsZ0l6x3C_SYqhqVV7dEG-TafCCNiIxs8qeUiXQ8cHWVclqkH4Lo1qH',
    },
  },
})

export const MEDIATOR1_SECRETS: Array<Secret> = [
  MEDIATOR1_SECRET_KEY_AGREEMENT_KEY_X25519_1,
  MEDIATOR1_SECRET_KEY_AGREEMENT_KEY_P256_1,
  MEDIATOR1_SECRET_KEY_AGREEMENT_KEY_P384_1,
  MEDIATOR1_SECRET_KEY_AGREEMENT_KEY_P521_1,
]

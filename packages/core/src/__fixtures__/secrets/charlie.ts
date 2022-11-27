import { Secret, SecretMaterialType, SecretType } from "../../secrets"

export const CHARLIE_SECRET_KEY_AGREEMENT_KEY_X25519 = new Secret({
  id: "did:example:charlie#key-x25519-1",
  type: SecretType.JsonWebKey2020,
  secretMaterial: {
    type: SecretMaterialType.Jwk,
    value: {
      kty: "OKP",
      crv: "X25519",
      x: "nTiVFj7DChMsETDdxd5dIzLAJbSQ4j4UG6ZU1ogLNlw",
      d: "Z-BsgFe-eCvhuZlCBX5BV2XiDE2M92gkaORCe68YdZI",
    },
  },
})

export const CHARLIE_SECRET_AUTH_KEY_ED25519 = new Secret({
  id: "did:example:charlie#key-1",
  type: SecretType.JsonWebKey2020,
  secretMaterial: {
    type: SecretMaterialType.Jwk,
    value: {
      kty: "OKP",
      crv: "Ed25519",
      x: "VDXDwuGKVq91zxU6q7__jLDUq8_C5cuxECgd-1feFTE",
      d: "T2azVap7CYD_kB8ilbnFYqwwYb5N-GcD6yjGEvquZXg",
    },
  },
})

export const CHARLIE_SECRETS: Array<Secret> = [CHARLIE_SECRET_KEY_AGREEMENT_KEY_X25519, CHARLIE_SECRET_AUTH_KEY_ED25519]

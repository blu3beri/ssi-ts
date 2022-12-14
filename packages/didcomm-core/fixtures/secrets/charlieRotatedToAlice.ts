import type { Secret } from '../../src/secrets'

import {
  ALICE_SECRET_AUTH_KEY_ED25519,
  ALICE_SECRET_AUTH_KEY_P256,
  ALICE_SECRET_AUTH_KEY_SECP256K1,
  ALICE_SECRET_KEY_AGREEMENT_KEY_P256,
  ALICE_SECRET_KEY_AGREEMENT_KEY_P521,
  ALICE_SECRET_KEY_AGREEMENT_KEY_X25519,
} from './alice'
import { CHARLIE_SECRET_AUTH_KEY_ED25519, CHARLIE_SECRET_KEY_AGREEMENT_KEY_X25519 } from './charlie'

export const CHARLIE_ROTATED_TO_ALICE_SECRETS: Array<Secret> = [
  CHARLIE_SECRET_KEY_AGREEMENT_KEY_X25519,
  CHARLIE_SECRET_AUTH_KEY_ED25519,
  ALICE_SECRET_AUTH_KEY_ED25519,
  ALICE_SECRET_AUTH_KEY_P256,
  ALICE_SECRET_AUTH_KEY_SECP256K1,
  ALICE_SECRET_KEY_AGREEMENT_KEY_X25519,
  ALICE_SECRET_KEY_AGREEMENT_KEY_P256,
  ALICE_SECRET_KEY_AGREEMENT_KEY_P521,
]

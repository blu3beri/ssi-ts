import { assertProvider } from "../utils"
import { CryptoProvider } from "./CryptoProvider"

export let cryptoProvider: CryptoProvider

export const assertCryptoProvider = (fields: Array<keyof CryptoProvider>) => assertProvider(fields, cryptoProvider)

export const setCryptoProvider = (provider: CryptoProvider) => {
  cryptoProvider = provider
}

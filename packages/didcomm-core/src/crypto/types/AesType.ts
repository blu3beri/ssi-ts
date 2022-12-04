import type { AesTypes } from './AesTypes'

export interface AesType {
  keySize: number
  algType: AesTypes
  jwkAlg: string
}

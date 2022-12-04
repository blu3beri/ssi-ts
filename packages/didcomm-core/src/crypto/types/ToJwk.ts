import type { Jwk } from '../../did'

export abstract class ToJwk {
  public abstract tojwk(): Jwk
}

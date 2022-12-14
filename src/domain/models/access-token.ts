
const THIRTY_MINUTES_IN_MS = 1800000
export class AccessToken {
  constructor (private readonly value: string) {}

  static get expirationInMs ():number {
    return THIRTY_MINUTES_IN_MS
  }
}

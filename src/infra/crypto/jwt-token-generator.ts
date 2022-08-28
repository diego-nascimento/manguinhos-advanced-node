import { TokenGenerator } from "@/data/contracts/crypto"
import { sign } from 'jsonwebtoken'

export class JwtTokenGenerator implements TokenGenerator {
  constructor (private readonly secret: string) {}

  async generateToken (params: TokenGenerator.params):Promise<TokenGenerator.Result> {
    const expirationInSeconds = params.expirationInMs
    return sign({ key: params.key, }, this.secret, { expiresIn: expirationInSeconds / 1000 })
  }
}

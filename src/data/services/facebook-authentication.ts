import { AuthenticationError } from "@/domain/errors"
import { FacebookAuthentication } from "@/domain/features"
import { FacebookAccount } from "@/domain/models/facebook-account"
import { LoadFacebookUserApi } from "../contracts/apis"
import { LoadUserAccountRepository, SaveFacebookAccountRepository } from "../contracts/repos"
import { TokenGenerator } from "@/data/contracts/crypto"

export class FacebookAuthenticationService implements FacebookAuthentication {
  constructor (
    private readonly facebookApi: LoadFacebookUserApi,
    private readonly userAccountRepo: LoadUserAccountRepository & SaveFacebookAccountRepository,
    private readonly crypto: TokenGenerator,) {
  }

  async perform (params: FacebookAuthentication.Params):Promise<AuthenticationError> {
    const fbData = await this.facebookApi.loadUser(params)
    if (fbData !== undefined) {
      const accountData = await this.userAccountRepo.load({ email: fbData.email })
      const fbAccount = new FacebookAccount(fbData, accountData)
      const { id } = await this.userAccountRepo.saveWithFacebook(fbAccount)
      await this.crypto.generateToken({
        key: id
      })
    }
    return new AuthenticationError()
  }
}

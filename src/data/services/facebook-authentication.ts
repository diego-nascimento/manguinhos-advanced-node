import { AuthenticationError } from "@/domain/errors"
import { FacebookAuthentication } from "@/domain/features"
import { LoadFacebookUserApi } from "../contracts/apis"

export class FacebookAuthenticationService {
  private readonly loadFacebookUserApi: LoadFacebookUserApi

  constructor (loadFacebookUserApi: LoadFacebookUserApi) {
    this.loadFacebookUserApi = loadFacebookUserApi
  }

  async perform (params: FacebookAuthentication.Params):Promise<AuthenticationError> {
    this.loadFacebookUserApi.loadUser(params)
    return new AuthenticationError()
  }
}

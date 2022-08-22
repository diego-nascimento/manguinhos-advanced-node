import { FacebookAuthentication } from "@/domain/features"

namespace LoadFacebookUserApiSpy {
  export type Params = {
    token: string
  }
}

interface LoadFacebookUserApi {
  loadUser(params: LoadFacebookUserApiSpy.Params):Promise<void>
}

class LoadFacebookUserApiSpy implements LoadFacebookUserApi {
  token?: string
  async loadUser (params: LoadFacebookUserApiSpy.Params): Promise<void> {
    this.token = params.token
  }
}

class FacebookAuthenticationService {
  constructor (
    private readonly loadFacebookUserApi: LoadFacebookUserApi
  ) {}

  async perform (params: FacebookAuthentication.Params):Promise<void> {
    this.loadFacebookUserApi.loadUser(params)
  }
}

describe('FacebookAuthenticationService', () => {
  it('Should call loadFacebookUserApi with correct params', async () => {
    const loadFacebookUserApi = new LoadFacebookUserApiSpy()
    const sut = new FacebookAuthenticationService(loadFacebookUserApi)

    await sut.perform({ token: 'any_token' })
    expect(loadFacebookUserApi.token).toBe('any_token')
  })
})

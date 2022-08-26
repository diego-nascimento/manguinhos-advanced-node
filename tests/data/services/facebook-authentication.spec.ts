import { LoadFacebookUserApi } from "@/data/contracts/apis"
import { SaveFacebookAccountRepository, LoadUserAccountRepository } from "@/data/contracts/repos"
import { FacebookAuthenticationService } from "@/data/services"
import { AuthenticationError } from "@/domain/errors"
import { FacebookAccount } from "@/domain/models"

import { mock, MockProxy } from 'jest-mock-extended'

jest.mock('@/domain/models/facebook-account')
describe('FacebookAuthenticationService', () => {
  let facebookApi: MockProxy<LoadFacebookUserApi>
  let userAccountRepo: MockProxy<LoadUserAccountRepository & SaveFacebookAccountRepository >
  let sut: FacebookAuthenticationService

  const token: string = 'any_token'

  beforeEach(() => {
    facebookApi = mock()
    facebookApi.loadUser.mockResolvedValue({
      name: 'any_fbname',
      email: 'any_fbEmail',
      facebookId: 'any_fbID',
    })
    userAccountRepo = mock()
    userAccountRepo.load.mockResolvedValue(undefined)
    sut = new FacebookAuthenticationService(facebookApi, userAccountRepo)
  })
  it('Should call loadFacebookUserApi with correct params', async () => {
    await sut.perform({ token })
    expect(facebookApi.loadUser).toHaveBeenCalledTimes(1)
    expect(facebookApi.loadUser).toHaveBeenCalledWith({ token })
  })

  it('Should return authenticationError when facebookApi returns undefined', async () => {
    facebookApi.loadUser.mockResolvedValueOnce(undefined)
    const authResult = await sut.perform({ token })
    expect(authResult).toStrictEqual(new AuthenticationError())
  })

  it('Should call LoadUserAccountRepo when loadFacebookUserApi returns data', async () => {
    await sut.perform({ token })
    expect(userAccountRepo.load).toHaveBeenCalledTimes(1)
    expect(userAccountRepo.load).toHaveBeenCalledWith({ email: 'any_fbEmail' })
  })

  it('Should call SaveFacebookAccountRepository with facebookAccount', async () => {
    await sut.perform({ token })
    const FacebookAccountStub = jest.fn().mockImplementation(() => ({}))
    jest.mocked(FacebookAccount).mockImplementation(FacebookAccountStub)
    expect(userAccountRepo.saveWithFacebook).toHaveBeenCalledTimes(1)
    expect(userAccountRepo.saveWithFacebook).toHaveBeenCalledWith({})
  })
})

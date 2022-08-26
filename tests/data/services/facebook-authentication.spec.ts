import { LoadFacebookUserApi } from "@/data/contracts/apis"
import { TokenGenerator } from "@/data/contracts/crypto"
import { SaveFacebookAccountRepository, LoadUserAccountRepository } from "@/data/contracts/repos"
import { FacebookAuthenticationService } from "@/data/services"
import { AuthenticationError } from "@/domain/errors"
import { AccessToken, FacebookAccount } from "@/domain/models"

import { mock, MockProxy } from 'jest-mock-extended'

jest.mock('@/domain/models/facebook-account')

describe('FacebookAuthenticationService', () => {
  let facebookApi: MockProxy<LoadFacebookUserApi>
  let crypto: MockProxy<TokenGenerator>
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
    crypto = mock()
    userAccountRepo = mock()
    userAccountRepo.load.mockResolvedValue(undefined)
    userAccountRepo.saveWithFacebook.mockResolvedValue({
      id: 'any_accountId'
    })
    crypto.generateToken.mockResolvedValue('any_generated_token')
    sut = new FacebookAuthenticationService(facebookApi, userAccountRepo, crypto)
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
    const FacebookAccountStub = jest.fn().mockImplementation(() => ({ any: 'any' }))
    jest.mocked(FacebookAccount).mockImplementation(FacebookAccountStub)

    await sut.perform({ token })
    expect(userAccountRepo.saveWithFacebook).toHaveBeenCalledTimes(1)
    expect(userAccountRepo.saveWithFacebook).toHaveBeenCalledWith({ any: 'any' })
  })

  it('Should call TokenGenerator with correct params', async () => {
    await sut.perform({ token })
    expect(crypto.generateToken).toHaveBeenCalledTimes(1)
    expect(crypto.generateToken).toHaveBeenCalledWith({
      key: 'any_accountId',
      expirationInMs: AccessToken.expirationInMs
    })
  })

  it('Should return an AccessToken on success', async () => {
    const authResult = await sut.perform({ token })
    expect(authResult).toEqual(new AccessToken('any_generated_token'))
  })
})

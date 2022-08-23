import { LoadFacebookUserApi } from "@/data/contracts/apis"
import { SaveFacebookAccountRepository, LoadUserAccountRepository } from "@/data/contracts/repos"
import { FacebookAuthenticationService } from "@/data/services"
import { AuthenticationError } from "@/domain/errors"
import { mock, MockProxy } from 'jest-mock-extended'

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

  it('Should call create account with facebook data', async () => {
    await sut.perform({ token })
    expect(userAccountRepo.saveWithFacebook).toHaveBeenCalledTimes(1)
    expect(userAccountRepo.saveWithFacebook).toHaveBeenCalledWith({ email: 'any_fbEmail', name: 'any_fbname', facebookId: 'any_fbID' })
  })

  it('Should not update account name', async () => {
    userAccountRepo.load.mockResolvedValueOnce({
      id: 'any_id',
      name: 'any_name'
    })
    await sut.perform({ token })
    expect(userAccountRepo.saveWithFacebook).toHaveBeenCalledTimes(1)
    expect(userAccountRepo.saveWithFacebook).toHaveBeenCalledWith({ facebookId: 'any_fbID', id: 'any_id', name: 'any_name', email: "any_fbEmail" })
  })

  it('Should update account name', async () => {
    userAccountRepo.load.mockResolvedValueOnce({
      id: 'any_id',
    })
    await sut.perform({ token })
    expect(userAccountRepo.saveWithFacebook).toHaveBeenCalledTimes(1)
    expect(userAccountRepo.saveWithFacebook).toHaveBeenCalledWith({ facebookId: 'any_fbID', id: 'any_id', email: 'any_fbEmail', name: 'any_fbname' })
  })
})

import { LoadFacebookUserApi } from "@/data/contracts/apis"
import { HttpGetClient } from "../http"

export class FacebookApi {
  private readonly baseUrl = 'https://graph.facebook.com'
  private readonly endPoint = '/oauth/access_token'

  constructor (
    private readonly httpClient: HttpGetClient,
    private readonly clientId: string,
    private readonly secretId: string
  ) {}

  async loadUser (params: LoadFacebookUserApi.Params): Promise<void> {
    await this.httpClient.get({
      url: `${this.baseUrl}${this.endPoint}`,
      params: {
        client_id: this.clientId,
        client_secret: this.secretId,
        grant_type: 'client_credentials'
      }
    })
  }
}

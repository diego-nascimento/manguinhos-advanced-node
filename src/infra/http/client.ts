export namespace HttpGetClient {
  export type Params = {
    url: string
    params: Object
  }
}

export interface HttpGetClient {
  get: (params: HttpGetClient.Params) => Promise<void>
}

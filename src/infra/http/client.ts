export namespace HttpGetClient {
  export type Params = {
    url: string
    params: Object
  }

}

export interface HttpGetClient {
  get: <T = any>(params: HttpGetClient.Params) => Promise<T>
}


export namespace TokenGenerator {
  export type params = {
    key: string
    expirationInMs: number
  }

  export type Result = string

}
export interface TokenGenerator {
  generateToken: (params: TokenGenerator.params) => Promise<TokenGenerator.Result>
}

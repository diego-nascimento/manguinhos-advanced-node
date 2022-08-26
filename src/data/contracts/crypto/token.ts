
export namespace TokenGenerator {
  export type params = {
    key: string
  }
}
export interface TokenGenerator {
  generateToken: (params: TokenGenerator.params) => Promise<void>
}

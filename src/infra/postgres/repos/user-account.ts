import { LoadUserAccountRepository } from "@/data/contracts/repos"
import { getRepository } from "typeorm"
import { PgUser } from "../entities"

export class PgUserAccountRepository implements LoadUserAccountRepository {
  async load (params: LoadUserAccountRepository.Params):Promise<LoadUserAccountRepository.Result> {
    const pgUserRepo = getRepository(PgUser)
    const pgUser = await pgUserRepo.findOne({
      email: params.email
    })
    if (pgUser) {
      return {
        id: pgUser.id?.toString(),
        name: pgUser?.name ?? undefined
      }
    }
  }
}

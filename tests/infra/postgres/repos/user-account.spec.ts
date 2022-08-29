import { getConnection, getRepository, Repository, } from "typeorm"
import { IBackup } from 'pg-mem'
import { PgUser } from "@/infra/postgres/entities"
import { PgUserAccountRepository } from "@/infra/postgres/repos";
import { makeFakeDb } from "../mocks";

describe('PgUserAccountRepository', () => {
  describe('load', () => {
    let sut: PgUserAccountRepository
    let PgUserRepo: Repository<PgUser>
    let backup: IBackup

    beforeAll(async () => {
      const db = await makeFakeDb()
      backup = db.backup()
      PgUserRepo = getRepository(PgUser)
    })

    afterAll(async () => {
      await getConnection().close
    })

    beforeEach(() => {
      backup.restore()
      sut = new PgUserAccountRepository()
    })

    it('Should return an account if email exists', async () => {
      await PgUserRepo.save({ email: 'existing_email' })

      const account = await sut.load({ email: 'existing_email' })

      expect(account).toEqual({ id: "1" })
    })

    it('Should return undefined if email does not exists', async () => {
      const account = await sut.load({ email: 'new_email' })

      expect(account).toBeUndefined()
    })
  })
})

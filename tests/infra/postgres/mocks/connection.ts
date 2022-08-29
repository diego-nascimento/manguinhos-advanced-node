import { IMemoryDb, newDb } from "pg-mem";

export const makeFakeDb = async (entities: any[] = ['src/infra/postgres/entities/index.ts']): Promise<IMemoryDb> => {
  const db = newDb();
  const connection = await db.adapters.createTypeormConnection({
    type: 'postgres',
    entities
  })
  await connection.synchronize();
  return db
}

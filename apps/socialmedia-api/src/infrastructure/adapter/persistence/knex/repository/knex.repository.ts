import { Knex } from "knex";

import {
  Entity,
  RepositoryPort,
  Mapper,
  Optional,
  IdentifierPort,
  AppException,
  InternalServerError,
  Conflict,
} from "@repo/nestjs-libs";

export class KnexTransaction {
  constructor(readonly transaction: Knex.Transaction<any, any[]>) {}
}

export abstract class KnexRepository<E extends Entity<any>, M> implements RepositoryPort<E> {
  protected abstract tableName: string;

  constructor(
    readonly knex: Knex,
    readonly mapper: Mapper<E, M>,
  ) {}

  abstract transacting(trx: KnexTransaction): RepositoryPort<E>;

  async create(entity: E): Promise<{ id: any }> {
    const model = this.mapper.toModel(entity);

    try {
      const result = await this.knex(this.tableName).insert(model);
      return {
        id: result[0],
      };
    } catch (err: any) {
      if (err.code === "ER_DUP_ENTRY") {
        throw AppException.new({ code: Conflict, cause: err });
      }
      throw AppException.new({ code: InternalServerError, cause: err });
    }
  }

  async findOneById(id: IdentifierPort): Promise<Optional<E>> {
    let result: Optional<E>;

    const row: Optional<M> = await this.knex(this.tableName).select().where("id", id).first();
    if (row) {
      result = this.mapper.toDomainEntity(row);
    }

    return result;
  }

  async removeById(id: IdentifierPort): Promise<boolean> {
    const result = await this.knex(this.tableName).where("id", id).del();

    return result > 0;
  }

  async transaction<T>(callback: (tx: any) => Promise<T>): Promise<T> {
    return await this.knex.transaction(async (knexTrx) => {
      try {
        const baseTrx = new KnexTransaction(knexTrx);
        return await callback(baseTrx);
      } catch (err) {
        knexTrx.rollback();
        throw err;
      } finally {
        console.log("finish transaction");
      }
    });
  }
}

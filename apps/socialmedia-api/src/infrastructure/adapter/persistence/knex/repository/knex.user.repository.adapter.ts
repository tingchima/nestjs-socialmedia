import { Knex } from "knex";
import { Inject, Injectable } from "@nestjs/common";

import { UserEntity } from "@core/domain/user/entity/user.entity";
import {
  KnexRepository,
  KnexTransaction,
} from "@infrastructure/adapter/persistence/knex/repository/knex.repository";
import { UserInjectTokens } from "@core/domain/user/user.inject.tokens";
import { UserRepositoryPort } from "@core/domain/user/interface/user.repository.port";
import { KnexInjectTokens, Optional, RepositoryPort } from "@repo/nestjs-libs";
import { UserMapper } from "@infrastructure/adapter/persistence/knex/mapper/user.mapper";
import {
  TableNameUserModel,
  UserModel,
} from "@infrastructure/adapter/persistence/knex/model/user.model";

@Injectable()
export class KnexUserRepositoryAdapter
  extends KnexRepository<UserEntity, UserModel>
  implements UserRepositoryPort
{
  protected tableName: string = TableNameUserModel;

  constructor(
    @Inject(KnexInjectTokens.KNEX_CONNECTION) readonly knex: Knex,
    @Inject(UserInjectTokens.USER_MAPPER) readonly mapper: UserMapper,
  ) {
    super(knex, mapper);
  }

  transacting(trx: KnexTransaction): RepositoryPort<UserEntity> {
    return new KnexUserRepositoryAdapter(trx.transaction, this.mapper);
  }

  public async findUserByEmail(email: string): Promise<Optional<UserEntity>> {
    let result: Optional<UserEntity>;

    const row = await this.knex(this.tableName).select().where("email", email).first();
    if (row) {
      result = this.mapper.toDomainEntity(row);
    }

    return result;
  }
}

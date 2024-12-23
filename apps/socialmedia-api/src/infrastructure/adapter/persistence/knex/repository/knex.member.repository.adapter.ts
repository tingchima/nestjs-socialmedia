import { Knex } from "knex";
import { Inject, Injectable } from "@nestjs/common";

import {
  KnexRepository,
  KnexTransaction,
} from "@infrastructure/adapter/persistence/knex/repository/knex.repository";
import {
  AppException,
  InternalServerError,
  KnexInjectTokens,
  RepositoryFindOptions,
  RepositoryPort,
} from "@repo/nestjs-libs";
import { ChatroomInjectTokens } from "@core/domain/chatroom/chatroom.inject.tokens";
import { MemberMapper } from "@infrastructure/adapter/persistence/knex/mapper/member.mapper";
import { MemberEntity } from "@core/domain/chatroom/entity/member.entity";
import {
  MemberModel,
  TableNameMemberModel,
} from "@infrastructure/adapter/persistence/knex/model/member.model";
import { MemberRepositoryPort } from "@core/domain/chatroom/interface/member.repository.port";

@Injectable()
export class KnexMemberRepositoryAdapter
  extends KnexRepository<MemberEntity, MemberModel>
  implements MemberRepositoryPort
{
  protected tableName: string = TableNameMemberModel;

  constructor(
    @Inject(KnexInjectTokens.KNEX_CONNECTION) readonly knex: Knex,
    @Inject(ChatroomInjectTokens.MEMBER_MAPPER) readonly mapper: MemberMapper,
  ) {
    super(knex, mapper);
  }

  transacting(trx: KnexTransaction): RepositoryPort<MemberEntity> {
    return new KnexMemberRepositoryAdapter(trx.transaction, this.mapper);
  }

  public async existsMember(by: { channelId: number; userId: number }): Promise<boolean> {
    try {
      const result = await this.knex(this.tableName)
        .count("id as count")
        .where({ channel_id: by.channelId, user_id: by.userId });
      return (result[0].count as number) > 0;
    } catch (err: any) {
      throw AppException.new({ code: InternalServerError, cause: err });
    }
  }

  public async findChannelIds(
    by: { userId: number },
    options: RepositoryFindOptions = {},
  ): Promise<number[]> {
    try {
      const qb = this.knex(this.tableName).select("channel_id").where("user_id", by.userId);

      if (options.limit) {
        qb.limit(options.limit);
      }

      if (options.offset) {
        qb.offset(options.offset);
      }

      if (options.includeDeleted) {
        qb.whereNotNull("deleted_at");
      }

      return (await qb).map((member) => member.channel_id);
    } catch (err: any) {
      throw AppException.new({ code: InternalServerError, cause: err });
    }
  }

  public async findUserIds(
    by: { channelId: number },
    options: RepositoryFindOptions = {},
  ): Promise<number[]> {
    try {
      const qb = this.knex(this.tableName).select("user_id").where("channel_id", by.channelId);

      if (options.limit) {
        qb.limit(options.limit);
      }

      if (options.offset) {
        qb.offset(options.offset);
      }

      if (options.includeDeleted) {
        qb.whereNotNull("deleted_at");
      }

      return (await qb).map((member) => member.user_id);
    } catch (err: any) {
      throw AppException.new({ code: InternalServerError, cause: err });
    }
  }
}

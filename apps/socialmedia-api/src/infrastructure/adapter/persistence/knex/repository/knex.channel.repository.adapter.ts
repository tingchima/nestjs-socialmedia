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
  RepositoryPort,
} from "@repo/nestjs-libs";
import { ChannelRepositoryPort } from "@core/domain/chatroom/interface/channel.repository.port";
import { ChatroomInjectTokens } from "@core/domain/chatroom/chatroom.inject.tokens";
import { ChannelMapper } from "@infrastructure/adapter/persistence/knex/mapper/channel.mapper";
import { ChannelEntity } from "@core/domain/chatroom/entity/channel.entity";
import {
  ChannelModel,
  TableNameChannelModel,
} from "@infrastructure/adapter/persistence/knex/model/channel.model";

@Injectable()
export class KnexChannelRepositoryAdapter
  extends KnexRepository<ChannelEntity, ChannelModel>
  implements ChannelRepositoryPort
{
  protected tableName: string = TableNameChannelModel;

  constructor(
    @Inject(KnexInjectTokens.KNEX_CONNECTION) readonly knex: Knex,
    @Inject(ChatroomInjectTokens.CHANNEL_MAPPER) readonly mapper: ChannelMapper,
  ) {
    super(knex, mapper);
  }

  transacting(trx: KnexTransaction): RepositoryPort<ChannelEntity> {
    return new KnexChannelRepositoryAdapter(trx.transaction, this.mapper);
  }

  public async existsChannel(by: { id: number }): Promise<boolean> {
    try {
      const result = await this.knex(this.tableName).count("id as count").where({ id: by.id });
      return (result[0].count as number) > 0;
    } catch (err: any) {
      throw AppException.new({ code: InternalServerError, cause: err });
    }
  }
}

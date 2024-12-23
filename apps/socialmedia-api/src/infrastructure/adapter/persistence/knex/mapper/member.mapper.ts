import { Injectable } from "@nestjs/common";

import { Mapper } from "@repo/nestjs-libs";
import { MemberEntity } from "@core/domain/chatroom/entity/member.entity";
import { MemberModel } from "@infrastructure/adapter/persistence/knex/model/member.model";

@Injectable()
export class MemberMapper implements Mapper<MemberEntity, MemberModel> {
  toModel(entity: MemberEntity): MemberModel {
    return {
      channel_id: entity.getChannelId(),
      user_id: entity.getUserId(),
      is_admin: entity.getIsAdmin(),
      last_read_at: entity.getLastReadAt() as Date,
      start_read_time: entity.getStartReadTime() as Date,
      created_at: entity.getCreatedAt(),
      updated_at: entity.getUpdatedAt() as Date,
      deleted_at: entity.getDeletedAt() as Date,
    };
  }

  toModels(entities: MemberEntity[]): MemberModel[] {
    return entities.map((item) => this.toModel(item));
  }

  toDomainEntity(record: MemberModel): MemberEntity {
    return new MemberEntity({
      id: record.id,
      channelId: record.channel_id,
      userId: record.user_id,
      isAdmin: record.is_admin,
      lastReadAt: record.last_read_at,
      startReadTime: record.start_read_time,
      createdAt: record.created_at,
      updatedAt: record.updated_at,
      deletedAt: record.deleted_at,
    });
  }

  toDomainEntities(records: MemberModel[]): MemberEntity[] {
    return records.map((item) => this.toDomainEntity(item));
  }
}

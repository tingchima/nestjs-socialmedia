import { Injectable } from "@nestjs/common";

import { Mapper } from "@repo/nestjs-libs";
import { ChannelEntity } from "@core/domain/chatroom/entity/channel.entity";
import { ChannelModel } from "@infrastructure/adapter/persistence/knex/model/channel.model";
import { channelTypeFromString } from "@core/domain/chatroom/entity/enum/channel.type";

@Injectable()
export class ChannelMapper implements Mapper<ChannelEntity, ChannelModel> {
  toModel(entity: ChannelEntity): ChannelModel {
    return {
      display_name: entity.getDisplayName(),
      avatar_path: entity.getAvatarPath(),
      type: entity.getType().toString(),
      last_message_time: entity.getLasMessageTime() as Date,
      created_at: entity.getCreatedAt(),
      updated_at: entity.getUpdatedAt() as Date,
    };
  }

  toModels(entities: ChannelEntity[]): ChannelModel[] {
    return entities.map((item) => this.toModel(item));
  }

  toDomainEntity(record: ChannelModel): ChannelEntity {
    return new ChannelEntity({
      id: record.id,
      displayName: record.display_name,
      avatarPath: record.avatar_path,
      type: channelTypeFromString(record.type),
      lastMessageTime: record.last_message_time,
      createdAt: record.created_at,
      updatedAt: record.updated_at,
    });
  }

  toDomainEntities(records: ChannelModel[]): ChannelEntity[] {
    return records.map((item) => this.toDomainEntity(item));
  }
}

import { Injectable } from "@nestjs/common";

import { Mapper } from "@repo/nestjs-libs";
import { ChatEntity } from "@core/domain/chatroom/entity/chat.entity";
import { ChatModel } from "@infrastructure/adapter/persistence/elasticsearch/model/chat.model";

@Injectable()
export class ChatMapper implements Mapper<ChatEntity, ChatModel> {
  toModel(entity: ChatEntity): ChatModel {
    return {
      channel_id: entity.getChannelId(),
      created_at: entity.getCreatedAt().toISOString(),
      sender_id: entity.getSenderId(),
      text: entity.getText(),
      ignored_user_ids: entity.getIgnoredUserIds(),
      updated_at: entity.getUpdatedAt()?.toISOString() || "",
      is_retract: entity.getIsRetracted() !== undefined ? entity.getIsRetracted() : false,
    };
  }

  toModels(entities: ChatEntity[]): ChatModel[] {
    return entities.map((item) => this.toModel(item));
  }

  toDomainEntity(record: ChatModel): ChatEntity {
    return new ChatEntity({
      channelId: record.channel_id,
      senderId: record.sender_id,
      text: record.text,
      ignoredUserIds: record.ignored_user_ids,
      createdAt: new Date(record.created_at),
      updatedAt: new Date(record.updated_at),
      isRetract: record.is_retract,
    });
  }

  toDomainEntities(records: ChatModel[]): ChatEntity[] {
    return records.map((item) => this.toDomainEntity(item));
  }
}

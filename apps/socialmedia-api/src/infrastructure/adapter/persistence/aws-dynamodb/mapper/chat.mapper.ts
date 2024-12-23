import { Mapper } from "@repo/nestjs-libs";
import { ChatEntity } from "@core/domain/chatroom/entity/chat.entity";
import { ChatModel } from "@infrastructure/adapter/persistence/aws-dynamodb/model/chat.model";
import { Injectable } from "@nestjs/common";

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
      is_retract: entity.getIsRetracted() === undefined ? false : entity.getIsRetracted(),
      publish_at: entity.getPublishAt()?.toISOString() || "",
      delivered_at: entity.getDeliveredAt()?.toISOString() || "",
      acked_at: entity.getAckedAt()?.toISOString() || "",
    };
  }

  toModels(entities: ChatEntity[]): ChatModel[] {
    return entities.map((item) => this.toModel(item));
  }

  toDomainEntity(record: ChatModel): ChatEntity {
    return new ChatEntity({
      id: new Date(record.created_at).getTime(),
      channelId: record.channel_id,
      senderId: record.sender_id,
      text: record.text,
      ignoredUserIds: record.ignored_user_ids ? [...new Set(...record.ignored_user_ids)] : [],
      createdAt: new Date(record.created_at),
      updatedAt: new Date(record.updated_at),
      isRetract: record.is_retract,
      publishAt: record.publish_at ? new Date(record.publish_at) : undefined,
      deliveredAt: record.delivered_at ? new Date(record.delivered_at) : undefined,
      ackedAt: record.acked_at ? new Date(record.acked_at) : undefined,
    });
  }

  toDomainEntities(records: ChatModel[]): ChatEntity[] {
    return records.map((item) => this.toDomainEntity(item));
  }
}

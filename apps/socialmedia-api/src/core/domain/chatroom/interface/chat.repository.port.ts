import { ChatEntity } from "@core/domain/chatroom/entity/chat.entity";
import { Optional, RepositoryFindOptions } from "@repo/nestjs-libs";

export interface ChatRepositoryPort {
  createChat(params: ChatEntity): Promise<ChatEntity>;

  findChat(by: { channelId: number; createdAt: Date }): Promise<Optional<ChatEntity>>;

  findChats(
    by: { channelId: number; startId: number; endId?: number; ignoredUserId?: number },
    options?: RepositoryFindOptions,
  ): Promise<{ chats: ChatEntity[]; lastChatId: number }>;

  updateChat(params: ChatEntity): Promise<void>;

  batchUpdateIgnoredUser(by: {
    channelId: number;
    createdAts: Date[];
    userId: number;
  }): Promise<void>;

  updateChatOnPublish(by: { channelId: number; createdAt: Date; publishAt: Date }): Promise<void>;

  updateChatOnAcked(by: { channelId: number; createdAt: Date; ackedAt: Date }): Promise<void>;

  updateChatOnDeliveredAt(by: {
    channelId: number;
    createdAt: Date;
    deliveredAt: Date;
  }): Promise<void>;
}

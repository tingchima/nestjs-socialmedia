import { ChatEntity } from "@core/domain/chatroom/entity/chat.entity";
import { RepositoryFindOptions } from "@repo/nestjs-libs";

export interface ChatSearchRepositoryPort {
  searchChatList(
    by: {
      channelId: number;
      search: string;
      ignoredUserId: number;
    },
    options?: RepositoryFindOptions,
  ): Promise<{ chats: ChatEntity[]; total: number }>;
}

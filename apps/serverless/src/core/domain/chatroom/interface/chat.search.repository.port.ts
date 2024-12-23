import { ChatEntity } from "@core/domain/chatroom/entity/chat.entity";

export interface ChatSearchRepositoryPort {
  insertBulk(params: ChatEntity[]): Promise<void>;
}

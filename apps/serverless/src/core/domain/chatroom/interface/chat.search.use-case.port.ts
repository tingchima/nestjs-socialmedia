import { ChatEntityNewParams } from "@core/domain/chatroom/entity/chat.entity";

export interface ChatSearchInsertBulkPort {
  newParams: ChatEntityNewParams[];
}

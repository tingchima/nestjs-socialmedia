import { ChatSearchInsertBulkPort } from "@core/domain/chatroom/interface/chat.search.use-case.port";

export interface ChatSearchUseCase {
  insertBulk(params: ChatSearchInsertBulkPort): Promise<void>;
}

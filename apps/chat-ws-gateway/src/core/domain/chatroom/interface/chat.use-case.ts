import { ChatPublishPort, ChatOnAckedPort, ChatOnDeliveredPort } from "./chat.use-case.port";

export interface ChatUseCase {
  publishChat(params: ChatPublishPort): Promise<void>;

  onChatDelivered(params: ChatOnDeliveredPort): Promise<void>;

  onChatAcked(params: ChatOnAckedPort): Promise<void>;
}

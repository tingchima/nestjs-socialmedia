import { ChatUseCaseDto } from "@core/domain/chatroom/dto/chat.use-case.dto";
import {
  ChatCreatePort,
  ChatGetListPort,
  ChatGetPort,
  ChatOnAckedUpdatePort,
  ChatOnDeliveredUpdatePort,
  ChatOnPublishUpdatePort,
  ChatRemovePort,
  ChatRetractPort,
  ChatSearchListPort,
} from "@core/domain/chatroom/interface/chat.use-case.ports";

export interface ChatUseCase {
  createChat(params: ChatCreatePort): Promise<ChatUseCaseDto>;

  getChat(params: ChatGetPort): Promise<ChatUseCaseDto>;

  getChatList(params: ChatGetListPort): Promise<{ chats: ChatUseCaseDto[]; lastTokenId: number }>;

  removeChat(params: ChatRemovePort): Promise<void>;

  retractChat(params: ChatRetractPort): Promise<void>;

  updateChatOnPublish(params: ChatOnPublishUpdatePort): Promise<void>;

  updateChatOnDelivered(params: ChatOnDeliveredUpdatePort): Promise<void>;

  updateChatOnAcked(params: ChatOnAckedUpdatePort): Promise<void>;

  searchChatList(params: ChatSearchListPort): Promise<{ chats: ChatUseCaseDto[]; total: number }>;
}

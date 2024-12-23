import { Inject, Injectable } from "@nestjs/common";

import { ChatSearchUseCase } from "@core/domain/chatroom/interface/chat.search.use-case";
import { ChatSearchInsertBulkPort } from "@core/domain/chatroom/interface/chat.search.use-case.port";
import { ChatroomInjectTokens } from "@core/domain/chatroom/chatroom.inject.tokens";
import { ChatEntity } from "@core/domain/chatroom/entity/chat.entity";
import { ChatSearchRepositoryPort } from "@core/domain/chatroom/interface/chat.search.repository.port";

@Injectable()
export class ChatSearchService implements ChatSearchUseCase {
  constructor(
    @Inject(ChatroomInjectTokens.CHAT_SEARCH_REPOSITORY)
    private readonly chatSearchRepository: ChatSearchRepositoryPort,
  ) {}

  public async insertBulk(params: ChatSearchInsertBulkPort): Promise<void> {
    const chatEntites: ChatEntity[] = await Promise.all(
      params.newParams.map(async (item) => await ChatEntity.new(item)),
    );

    await this.chatSearchRepository.insertBulk(chatEntites);
  }
}

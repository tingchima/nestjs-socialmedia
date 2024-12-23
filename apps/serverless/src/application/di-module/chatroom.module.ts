import { Module, Provider } from "@nestjs/common";

import { ChatroomInjectTokens } from "@core/domain/chatroom/chatroom.inject.tokens";
import { ElasticsearchChatRepositoryAdapter } from "@infrastructure/adapter/persistence/elasticsearch/repository/elasticsearch.chat.repository.adapter";
import { ChatMapper } from "@infrastructure/adapter/persistence/elasticsearch/mapper/chat.mapper";
import { ChatSearchService } from "@core/service/chatroom/chat.search.service";

const repositoryProviders: Provider[] = [
  {
    provide: ChatroomInjectTokens.CHAT_SEARCH_REPOSITORY,
    useClass: ElasticsearchChatRepositoryAdapter,
  },
];

const mapperProviders: Provider[] = [
  { provide: ChatroomInjectTokens.CHAT_MAPPER, useClass: ChatMapper },
];

const useCaseProviders: Provider[] = [
  { provide: ChatroomInjectTokens.CHAT_USE_CASE, useClass: ChatSearchService },
];

@Module({
  imports: [],
  providers: [...repositoryProviders, ...mapperProviders, ...useCaseProviders],
  exports: [],
})
export class ChatroomModule {}

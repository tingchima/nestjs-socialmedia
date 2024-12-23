import { Inject, Injectable } from "@nestjs/common";
import { Client } from "@elastic/elasticsearch";

import { ElasticsearchRepository } from "@infrastructure/adapter/persistence/elasticsearch/repository/elasticsearch.repository";
import {
  ChatModel,
  TableNameChatModel,
} from "@infrastructure/adapter/persistence/elasticsearch/model/chat.model";
import { ChatEntity } from "@core/domain/chatroom/entity/chat.entity";

import { ChatroomInjectTokens } from "@core/domain/chatroom/chatroom.inject.tokens";
import { ChatMapper } from "@infrastructure/adapter/persistence/elasticsearch/mapper/chat.mapper";
import {
  AppException,
  ElasticsearchInjectTokens,
  InternalServerError,
  RepositoryFindOptions,
} from "@repo/nestjs-libs";
import { ChatSearchRepositoryPort } from "@core/domain/chatroom/interface/chat.search.repository.port";

@Injectable()
export class ElasticsearchChatRepositoryAdapter
  extends ElasticsearchRepository<ChatEntity, ChatModel>
  implements ChatSearchRepositoryPort
{
  protected indexName: string = TableNameChatModel;

  constructor(
    @Inject(ElasticsearchInjectTokens.ELASRICSEARCH_CLIENT)
    readonly client: Client,

    @Inject(ChatroomInjectTokens.CHAT_MAPPER) readonly mapper: ChatMapper,
  ) {
    super(client, mapper);
  }

  public async searchChatList(
    by: {
      channelId: number;
      search: string;
      ignoredUserId: number;
    },
    options: RepositoryFindOptions = {},
  ): Promise<{ chats: ChatEntity[]; total: number }> {
    if (!options.offset || options.offset <= 0) {
      options.offset = 1;
    }
    const limit = options.limit ? options.limit : 20;
    const offset = options.offset - 1;

    try {
      const { body: searchResponse } = await this.client.search({
        index: this.indexName,
        body: {
          from: limit * offset,
          size: limit,
          sort: [{ created_at: { order: options.orderBy?.order } }],
          query: {
            bool: {
              must: [{ term: { channel_id: by.channelId } }, { term: { is_retract: false } }],
              must_not: [{ terms: { ignored_user_ids: [by.ignoredUserId] } }],
              should: [{ match: { text: { query: by.search } } }],
              minimum_should_match: 1,
            },
          },
        },
      });

      let chats: ChatEntity[] = [];
      let total: number = 0;

      if (searchResponse.hits && searchResponse.hits.hits.length > 0) {
        total = searchResponse.hits.total.value;
        chats = this.mapper.toDomainEntities(
          searchResponse.hits.hits.map((hit: any) => {
            return hit._source;
          }),
        );
      }

      return { chats, total };
    } catch (err: any) {
      throw AppException.new({ code: InternalServerError, cause: err });
    }
  }
}

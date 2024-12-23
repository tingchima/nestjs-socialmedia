import { Inject, Injectable } from "@nestjs/common";
import { Client } from "@elastic/elasticsearch";

import { ElasticsearchRepository } from "@infrastructure/adapter/persistence/elasticsearch/repository/elasticsearch.repository";
import {
  ChatModel,
  TableNameChatModel,
} from "@infrastructure/adapter/persistence/elasticsearch/model/chat.model";
import { ChatEntity } from "@core/domain/chatroom/entity/chat.entity";
import { ChatSearchRepositoryPort } from "@core/domain/chatroom/interface/chat.search.repository.port";
import { ChatroomInjectTokens } from "@core/domain/chatroom/chatroom.inject.tokens";
import { ChatMapper } from "@infrastructure/adapter/persistence/elasticsearch/mapper/chat.mapper";
import { ElasticsearchInjectTokens } from "@repo/nestjs-libs";

export type ErrorDocument = {
  status: number;
  error: Error;
};

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

  public async insertBulk(params: ChatEntity[]): Promise<void> {
    const models: ChatModel[] = this.mapper.toModels(params);

    const body = models.flatMap((doc) => [
      {
        index: {
          _id: `${doc.channel_id}_${doc.created_at}`,
          _index: this.indexName,
        },
      },
      doc,
    ]);

    const { body: bulkResponse } = await this.client.bulk({ refresh: true, body });

    if (bulkResponse.errors) {
      const erroredDocuments: ErrorDocument[] = [];
      bulkResponse.items.forEach((item: any) => {
        const operation = Object.keys(item)[0];
        if (item[operation].error) {
          erroredDocuments.push({
            status: item[operation].status,
            error: item[operation].error,
          });
        }
      });
      console.log("errors=", erroredDocuments);
    }
  }
}

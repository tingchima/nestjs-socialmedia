import { Inject, Injectable } from "@nestjs/common";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  PutCommand,
  GetCommand,
  QueryCommand,
  DynamoDBDocumentClient,
  TransactWriteCommand,
  UpdateCommand,
  NativeAttributeValue,
} from "@aws-sdk/lib-dynamodb";

import { ChatEntity } from "@core/domain/chatroom/entity/chat.entity";
import { ChatRepositoryPort } from "@core/domain/chatroom/interface/chat.repository.port";
import {
  AppException,
  AwsDynamoDBInjectTokens,
  InternalServerError,
  Optional,
  Order,
  RepositoryFindOptions,
} from "@repo/nestjs-libs";
import { AwsDynamoDBRepository } from "@infrastructure/adapter/persistence/aws-dynamodb/repository/aws.dynamodb.repository";
import {
  ChatModel,
  TableNameChatModel,
} from "@infrastructure/adapter/persistence/aws-dynamodb/model/chat.model";
import { ChatMapper } from "@infrastructure/adapter/persistence/aws-dynamodb/mapper/chat.mapper";
import { ChatroomInjectTokens } from "@core/domain/chatroom/chatroom.inject.tokens";

@Injectable()
export class AwsDynamoDBChatRepositoryAdapter
  extends AwsDynamoDBRepository<ChatEntity, ChatModel>
  implements ChatRepositoryPort
{
  protected tableName: string = TableNameChatModel;
  constructor(
    @Inject(AwsDynamoDBInjectTokens.AWS_DYNAMO_DB_CLIENT)
    readonly client: DynamoDBClient,

    @Inject(ChatroomInjectTokens.CHAT_MAPPER) readonly mapper: ChatMapper,
  ) {
    super(client, mapper);
  }

  private getChatKey(
    channelId: number,
    createdAt: Date,
  ): { channel_id: number; created_at: string } {
    return {
      channel_id: channelId,
      created_at: createdAt.toISOString(),
    };
  }

  public async createChat(params: ChatEntity): Promise<ChatEntity> {
    const model: ChatModel = this.mapper.toModel(params);

    try {
      const command = new PutCommand({
        TableName: this.tableName,
        Item: model,
      });

      await DynamoDBDocumentClient.from(this.client).send(command);

      return this.mapper.toDomainEntity(model);
    } catch (err: any) {
      throw AppException.new({ code: InternalServerError, cause: err });
    }
  }

  public async findChat(by: { channelId: number; createdAt: Date }): Promise<Optional<ChatEntity>> {
    const command: GetCommand = new GetCommand({
      TableName: this.tableName,
      Key: {
        channel_id: by.channelId,
        created_at: by.createdAt.toISOString(),
      },
    });

    let chat: Optional<ChatEntity>;

    try {
      const resp = await DynamoDBDocumentClient.from(this.client).send(command);
      if (resp.Item) {
        chat = this.mapper.toDomainEntity(resp.Item as ChatModel);
      }

      return chat;
    } catch (err: any) {
      throw AppException.new({ code: InternalServerError, cause: err });
    }
  }

  public async findChats(
    by: { channelId: number; startId: number; endId: number; ignoredUserId?: number },
    options?: RepositoryFindOptions,
  ): Promise<{ chats: ChatEntity[]; lastChatId: number }> {
    const isAscOrder: boolean = options?.orderBy?.order === Order.ASC;
    let keyConditionExpression: string = "channel_id = :channel_id";
    let filterExpression: string = " is_retract = :is_retract ";
    const expressionAttributeValues: Record<string, NativeAttributeValue> = {
      ":channel_id": by.channelId,
      ":is_retract": false,
    };

    if (isAscOrder) {
      keyConditionExpression = keyConditionExpression.concat(" AND created_at >= :start_time");
      expressionAttributeValues[":start_time"] = new Date(by.startId).toISOString();
    } else {
      keyConditionExpression = keyConditionExpression.concat(" AND created_at <= :end_time");
      expressionAttributeValues[":end_time"] = new Date(by.endId).toISOString();
    }

    if (by.ignoredUserId) {
      filterExpression = filterExpression.concat(
        " AND NOT contains(ignored_user_ids, :ignored_user_ids) ",
      );
      expressionAttributeValues[":ignored_user_ids"] = by.ignoredUserId.toString();
    }

    const command = new QueryCommand({
      TableName: this.tableName,
      KeyConditionExpression: keyConditionExpression,
      FilterExpression: filterExpression,
      ExpressionAttributeValues: expressionAttributeValues,
      ScanIndexForward: isAscOrder,
      Limit: options?.limit,
      ConsistentRead: true,
    });

    let chats: ChatEntity[] = [];

    try {
      const resp = await DynamoDBDocumentClient.from(this.client).send(command);
      if (resp.Items) {
        chats = this.mapper.toDomainEntities(resp.Items as ChatModel[]);
      }

      let lastChatId: number = 0;
      if (resp.LastEvaluatedKey) {
        lastChatId = new Date(resp.LastEvaluatedKey.created_at).getTime();
      }

      return { chats, lastChatId };
    } catch (err: any) {
      throw AppException.new({ code: InternalServerError, cause: err });
    }
  }

  public async updateChat(params: ChatEntity): Promise<void> {
    const model: ChatModel = this.mapper.toModel(params);

    try {
      const command = new UpdateCommand({
        TableName: this.tableName,
        Key: this.getChatKey(model.channel_id, params.getCreatedAt()),
        UpdateExpression: "SET is_retract = :is_retract",
        ExpressionAttributeValues: {
          ":is_retract": model.is_retract,
        },
        ReturnValues: "ALL_NEW",
      });

      await DynamoDBDocumentClient.from(this.client).send(command);
    } catch (err: any) {
      throw AppException.new({ code: InternalServerError, cause: err });
    }
  }

  public async batchUpdateIgnoredUser(by: {
    channelId: number;
    createdAts: Date[];
    userId: number;
  }): Promise<void> {
    try {
      const updatedAt = new Date().toISOString();

      const updateRequests = by.createdAts.map((createdAt) => ({
        Update: {
          TableName: this.tableName,
          Key: this.getChatKey(by.channelId, createdAt),
          UpdateExpression:
            "SET ignored_user_ids = list_append(if_not_exists(ignored_user_ids, :empty_list), :ignored_user_ids), updated_at = :updated_at",
          ExpressionAttributeValues: {
            ":empty_list": [],
            ":updated_at": updatedAt,
            ":ignored_user_ids": [by.userId.toString()],
          },
          ReturnValues: "ALL_NEW",
        },
      }));

      const command = new TransactWriteCommand({
        TransactItems: updateRequests,
      });

      await DynamoDBDocumentClient.from(this.client).send(command);
    } catch (err: any) {
      throw AppException.new({ code: InternalServerError, cause: err });
    }
  }

  public async updateChatOnPublish(by: {
    channelId: number;
    createdAt: Date;
    publishAt: Date;
  }): Promise<void> {
    try {
      const command = new UpdateCommand({
        TableName: this.tableName,
        Key: this.getChatKey(by.channelId, by.createdAt),
        UpdateExpression: "SET publish_at = :publish_at, updated_at = :updated_at",
        ExpressionAttributeValues: {
          ":publish_at": by.publishAt.toISOString(),
          ":updated_at": new Date().toISOString(),
        },
        ReturnValues: "UPDATED_NEW",
      });

      await DynamoDBDocumentClient.from(this.client).send(command);
    } catch (err: any) {
      throw AppException.new({ code: InternalServerError, cause: err });
    }
  }

  public async updateChatOnAcked(by: {
    channelId: number;
    createdAt: Date;
    ackedAt: Date;
  }): Promise<void> {
    try {
      const command = new UpdateCommand({
        TableName: this.tableName,
        Key: this.getChatKey(by.channelId, by.createdAt),
        UpdateExpression: "SET acked_at = :acked_at, updated_at = :updated_at",
        ExpressionAttributeValues: {
          ":acked_at": by.ackedAt.toISOString(),
          ":updated_at": new Date().toISOString(),
        },
        ReturnValues: "UPDATED_NEW",
      });

      await DynamoDBDocumentClient.from(this.client).send(command);
    } catch (err: any) {
      throw AppException.new({ code: InternalServerError, cause: err });
    }
  }

  public async updateChatOnDeliveredAt(by: {
    channelId: number;
    createdAt: Date;
    deliveredAt: Date;
  }): Promise<void> {
    try {
      const command = new UpdateCommand({
        TableName: this.tableName,
        Key: this.getChatKey(by.channelId, by.createdAt),
        UpdateExpression: "SET delivered_at = :delivered_at, updated_at = :updated_at",
        ExpressionAttributeValues: {
          ":delivered_at": by.deliveredAt.toISOString(),
          ":updated_at": new Date().toISOString(),
        },
        ReturnValues: "UPDATED_NEW",
      });

      await DynamoDBDocumentClient.from(this.client).send(command);
    } catch (err: any) {
      throw AppException.new({ code: InternalServerError, cause: err });
    }
  }
}

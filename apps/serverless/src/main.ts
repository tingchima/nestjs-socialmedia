import { HttpStatus } from "@nestjs/common";
import { Callback, Context, Handler } from "aws-lambda";

import { Application } from "@application/application";
import { ChatroomInjectTokens } from "@core/domain/chatroom/chatroom.inject.tokens";
import { unmarshall } from "@aws-sdk/util-dynamodb";
import { ChatModel } from "@infrastructure/adapter/persistence/aws-dynamodb/model/chat.model";
import { ChatEntityNewParams } from "@core/domain/chatroom/entity/chat.entity";
import { ChatSearchInsertBulkAdapter } from "@infrastructure/adapter/use-case/chat.use-case.adapter";

export const consumeChatStreams: Handler = async (
  event: any,
  context: Context,
  callback: Callback,
) => {
  const app: Application = Application.new();
  const ctx = await app.ctx();

  const chatSearchService = ctx.get(ChatroomInjectTokens.CHAT_USE_CASE);

  const newParams: ChatEntityNewParams[] = [];

  try {
    event.Records.forEach(async (record: any) => {
      const model: ChatModel = unmarshall(record.dynamodb.NewImage) as ChatModel;

      newParams.push({
        channelId: model.channel_id,
        senderId: model.sender_id,
        isRetract: model.is_retract,
        ignoredUserIds:
          model.ignored_user_ids && model.ignored_user_ids?.length > 0
            ? model.ignored_user_ids
            : undefined,
        createdAt: model.created_at ? new Date(model.created_at) : undefined,
        updatedAt: model.updated_at ? new Date(model.updated_at) : undefined,
        text: model.text,
      });
    });

    const adapter: ChatSearchInsertBulkAdapter = await ChatSearchInsertBulkAdapter.new({
      newParams,
    });

    await chatSearchService.insertBulk(adapter);

    callback(null, `Successfully processed ${event.Records.length} records.`);
    return {
      statusCode: HttpStatus.OK,
      body: {},
    };
  } catch (err: any) {
    return {
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      body: JSON.stringify(err.response ?? err.message),
    };
  }
};

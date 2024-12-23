import { Exclude, Expose, plainToClass } from "class-transformer";
import { IsDate, IsInstance, IsNumber, IsString } from "class-validator";
import Long from "long";

import {
  ChatOnAckedPort,
  ChatOnDeliveredPort,
  ChatPublishPort,
} from "@core/domain/chatroom/interface/chat.use-case.port";
import { UseCaseValidatorAdapter } from "@repo/nestjs-libs";
import { Chat } from "@core/domain/chatroom/value-object/chat.value-object";
import { protobufTimestampToDate } from "@repo/grpc";

@Exclude()
export class ChatPublishAdapter extends UseCaseValidatorAdapter implements ChatPublishPort {
  @Expose()
  public channelId: number;

  @Expose()
  @IsInstance(Chat)
  public chat: Chat;

  public static async new(params: ChatPublishPort): Promise<ChatPublishAdapter> {
    const adapter: ChatPublishAdapter = plainToClass(ChatPublishAdapter, params);

    const channelId = Long.fromValue(params.channelId).toNumber();

    adapter.channelId = channelId;
    adapter.chat = await Chat.new({
      channelId,
      text: params.chat.text,
      createdAt: protobufTimestampToDate({
        seconds: params.chat.createdAt.seconds,
        nanos: params.chat.createdAt.nanos,
      }),
    });

    await adapter.validate();
    return adapter;
  }
}

@Exclude()
export class ChatOnAckedAdapter extends UseCaseValidatorAdapter implements ChatOnAckedPort {
  @Expose()
  @IsNumber()
  public channelId: number;

  @Expose()
  @IsDate()
  public chatCreatedAt: Date;

  @Expose()
  @IsDate()
  public ackedAt: Date;

  public static async new(params: ChatOnAckedPort): Promise<ChatOnAckedAdapter> {
    const adapter: ChatOnAckedAdapter = plainToClass(ChatOnAckedAdapter, params);
    await adapter.validate();
    return adapter;
  }
}

@Exclude()
export class ChatOnDeliveredAdapter extends UseCaseValidatorAdapter implements ChatOnDeliveredPort {
  @Expose()
  @IsString()
  public chat: string;

  @Expose()
  @IsDate()
  public deliveredAt: Date;

  public static async new(params: ChatOnDeliveredPort): Promise<ChatOnDeliveredAdapter> {
    const adapter: ChatOnDeliveredAdapter = plainToClass(ChatOnDeliveredAdapter, params);
    await adapter.validate();
    return adapter;
  }
}

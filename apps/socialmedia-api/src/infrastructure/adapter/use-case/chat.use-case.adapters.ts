import { Exclude, Expose, plainToClass } from "class-transformer";
import {
  IsArray,
  IsBoolean,
  IsDate,
  IsEnum,
  IsIn,
  IsNumber,
  IsOptional,
  IsString,
} from "class-validator";

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
import { Order, UseCaseValidatorAdapter } from "@repo/nestjs-libs";
import { Scrolling, scrollingArray } from "@core/domain/chatroom/entity/enum/scrolling";

@Exclude()
export class ChatCreateAdapter extends UseCaseValidatorAdapter implements ChatCreatePort {
  @Expose()
  @IsNumber()
  public channelId: number;

  @Expose()
  @IsNumber()
  public senderId: number;

  @Expose()
  @IsString()
  public text: string;

  public static async new(params: ChatCreatePort): Promise<ChatCreateAdapter> {
    const adapter: ChatCreateAdapter = plainToClass(ChatCreateAdapter, params);
    await adapter.validate();
    return adapter;
  }
}

@Exclude()
export class ChatGetAdapter extends UseCaseValidatorAdapter implements ChatGetPort {
  @Expose()
  @IsNumber()
  public id: number;

  @Expose()
  @IsNumber()
  public channelId: number;

  @Expose()
  @IsNumber()
  public senderId: number;

  public static async new(params: ChatGetPort): Promise<ChatGetAdapter> {
    const adapter: ChatGetAdapter = plainToClass(ChatGetAdapter, params);
    await adapter.validate();
    return adapter;
  }
}

@Exclude()
export class ChatGetListAdapter extends UseCaseValidatorAdapter implements ChatGetListPort {
  @Expose()
  @IsNumber()
  public channelId: number;

  @Expose()
  @IsNumber()
  public startId: number;

  @Expose()
  @IsOptional()
  @IsNumber()
  public endId?: number;

  @Expose()
  @IsNumber()
  public perPage: number;

  @Expose()
  @IsIn(scrollingArray)
  public scrolling: Scrolling;

  @Expose()
  @IsNumber()
  public userId: number;

  public static async new(payload: ChatGetListPort): Promise<ChatGetListAdapter> {
    const adapter: ChatGetListAdapter = plainToClass(ChatGetListAdapter, payload);

    await adapter.validate();

    return adapter;
  }
}

@Exclude()
export class ChatRemoveAdapter extends UseCaseValidatorAdapter implements ChatRemovePort {
  @Expose()
  @IsArray()
  public ids: number[];

  @Expose()
  @IsBoolean()
  public isAll: boolean;

  @Expose()
  @IsNumber()
  public channelId: number;

  @Expose()
  @IsNumber()
  public userId: number;

  public static async new(params: ChatRemovePort): Promise<ChatRemoveAdapter> {
    const adapter: ChatRemoveAdapter = plainToClass(ChatRemoveAdapter, params);
    await adapter.validate();
    return adapter;
  }
}

@Exclude()
export class ChatRetractAdapter extends UseCaseValidatorAdapter implements ChatRetractPort {
  @Expose()
  @IsArray()
  public ids: number[];

  @Expose()
  @IsNumber()
  public channelId: number;

  @Expose()
  @IsNumber()
  public userId: number;

  public static async new(params: ChatRetractPort): Promise<ChatRetractAdapter> {
    const adapter: ChatRetractAdapter = plainToClass(ChatRetractAdapter, params);
    await adapter.validate();
    return adapter;
  }
}

@Exclude()
export class ChatOnPublishUpdateAdapter
  extends UseCaseValidatorAdapter
  implements ChatOnPublishUpdatePort
{
  @Expose()
  @IsNumber()
  public channelId: number;

  @Expose()
  @IsDate()
  public createdAt: Date;

  @Expose()
  @IsDate()
  public publishAt: Date;

  public static async new(params: ChatOnPublishUpdatePort): Promise<ChatOnPublishUpdateAdapter> {
    const adapter: ChatOnPublishUpdateAdapter = plainToClass(ChatOnPublishUpdateAdapter, params);
    await adapter.validate();
    return adapter;
  }
}

@Exclude()
export class ChatOnDeliveredUpdateAdapter
  extends UseCaseValidatorAdapter
  implements ChatOnDeliveredUpdatePort
{
  @Expose()
  @IsNumber()
  public channelId: number;

  @Expose()
  @IsDate()
  public createdAt: Date;

  @Expose()
  @IsDate()
  public deliveredAt: Date;

  public static async new(
    params: ChatOnDeliveredUpdatePort,
  ): Promise<ChatOnDeliveredUpdateAdapter> {
    const adapter: ChatOnDeliveredUpdateAdapter = plainToClass(
      ChatOnDeliveredUpdateAdapter,
      params,
    );
    await adapter.validate();
    return adapter;
  }
}

@Exclude()
export class ChatOnAckedUpdateAdapter
  extends UseCaseValidatorAdapter
  implements ChatOnAckedUpdatePort
{
  @Expose()
  @IsNumber()
  public channelId: number;

  @Expose()
  @IsDate()
  public createdAt: Date;

  @Expose()
  @IsDate()
  public ackedAt: Date;

  public static async new(params: ChatOnAckedUpdatePort): Promise<ChatOnAckedUpdateAdapter> {
    const adapter: ChatOnAckedUpdateAdapter = plainToClass(ChatOnAckedUpdateAdapter, params);
    await adapter.validate();
    return adapter;
  }
}

@Exclude()
export class ChatSearchListAdapter extends UseCaseValidatorAdapter implements ChatSearchListPort {
  @Expose()
  @IsNumber()
  public channelId: number;

  @Expose()
  @IsString()
  public search: string;

  @Expose()
  @IsNumber()
  public page: number;

  @Expose()
  @IsNumber()
  public perPage: number;

  @Expose()
  @IsNumber()
  public userId: number;

  @Expose()
  @IsEnum(Order)
  public order: Order;

  public static async new(params: ChatSearchListPort): Promise<ChatSearchListAdapter> {
    const adapter: ChatSearchListAdapter = plainToClass(ChatSearchListAdapter, params);
    await adapter.validate();
    return adapter;
  }
}

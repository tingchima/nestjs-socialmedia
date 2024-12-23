import { Exclude, Expose, plainToClass } from "class-transformer";
import { IsIn, IsNumber, IsString } from "class-validator";

import {
  ChannelCreatePort,
  ChannelGetPort,
  SubscriptionCreatePort,
  SubscriptionDeletePort,
} from "@core/domain/chatroom/interface/channel.use-case.ports";
import { ChannelType, channelTypeArray } from "@core/domain/chatroom/entity/enum/channel.type";
import { UseCaseValidatorAdapter } from "@repo/nestjs-libs";

@Exclude()
export class ChannelGetAdapter extends UseCaseValidatorAdapter implements ChannelGetPort {
  @Expose()
  @IsNumber()
  public channelId: number;

  @Expose()
  @IsNumber()
  public userId: number;

  public static async new(params: ChannelGetPort): Promise<ChannelGetAdapter> {
    const adapter: ChannelGetAdapter = plainToClass(ChannelGetAdapter, params);

    await adapter.validate();

    return adapter;
  }
}

@Exclude()
export class ChannelCreateAdapter extends UseCaseValidatorAdapter implements ChannelCreatePort {
  @Expose()
  @IsString()
  public displayName: string;

  @Expose()
  @IsIn(channelTypeArray)
  public type: ChannelType;

  @Expose()
  @IsString()
  public avatarPath: string;

  public static async new(params: ChannelCreatePort): Promise<ChannelCreateAdapter> {
    const adapter: ChannelCreateAdapter = plainToClass(ChannelCreateAdapter, params);

    await adapter.validate();

    return adapter;
  }
}

@Exclude()
export class SubscriptionCreateAdapter
  extends UseCaseValidatorAdapter
  implements SubscriptionCreatePort
{
  @Expose()
  @IsString()
  public node: string;

  @Expose()
  @IsString()
  public clientId: string;

  @Expose()
  @IsString()
  public userEmail: string;

  @Expose()
  @IsString()
  public accessToken: string;

  public static async new(params: SubscriptionCreatePort): Promise<SubscriptionCreateAdapter> {
    const adapter: SubscriptionCreateAdapter = plainToClass(SubscriptionCreateAdapter, params);

    await adapter.validate();

    return adapter;
  }
}

@Exclude()
export class SubscriptionDeleteAdapter
  extends UseCaseValidatorAdapter
  implements SubscriptionDeletePort
{
  @Expose()
  @IsString()
  public clientId: string;

  public static async new(params: SubscriptionDeletePort): Promise<SubscriptionDeleteAdapter> {
    const adapter: SubscriptionDeleteAdapter = plainToClass(SubscriptionDeleteAdapter, params);

    await adapter.validate();

    return adapter;
  }
}

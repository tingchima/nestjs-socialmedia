import { Exclude, Expose, plainToClass } from "class-transformer";
import { IsArray, IsString } from "class-validator";

import { UseCaseValidatorAdapter } from "@infrastructure/adapter/use-case/use-case.validator.adapter";
import {
  TopicSubscribeBulkPort,
  TopicSubscribePort,
  SubscriptionCreatePort,
  SubscriptionDeletePort,
} from "@core/domain/chatroom/interface/subscription.use-case.ports";

@Exclude()
export class SubscriptionCreateAdapter
  extends UseCaseValidatorAdapter
  implements SubscriptionCreatePort
{
  @Expose()
  @IsString()
  public clientId: string;

  @Expose()
  @IsString()
  public email: string;

  @Expose()
  @IsString()
  public token: string;

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

@Exclude()
export class SubscribeBulkAdapter
  extends UseCaseValidatorAdapter
  implements TopicSubscribeBulkPort
{
  @Expose()
  @IsArray()
  public subscribes: TopicSubscribePort[];

  public static async new(params: TopicSubscribeBulkPort): Promise<SubscribeBulkAdapter> {
    const adapter: SubscribeBulkAdapter = plainToClass(SubscribeBulkAdapter, params);
    await adapter.validate();
    return adapter;
  }
}

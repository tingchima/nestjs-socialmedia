import { Exclude, Expose, plainToClass } from "class-transformer";
import { SubscriptionEntity } from "../entity/subscription.entity";
import { RedisClientType } from "redis";

@Exclude()
export class SubscriptionUseCaseDto {
  @Expose()
  public clientId: string;

  @Expose()
  public pubSubKey: string;

  @Expose()
  public subscriber: RedisClientType;

  public static newFromSubscription(entity: SubscriptionEntity): SubscriptionUseCaseDto {
    return plainToClass(SubscriptionUseCaseDto, entity);
  }
}

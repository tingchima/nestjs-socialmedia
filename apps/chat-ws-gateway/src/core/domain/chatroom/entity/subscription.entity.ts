import { IsObject, IsString } from "class-validator";
import { RedisClientType } from "redis";
import { v4 } from "uuid";

import { Entity } from "@repo/nestjs-libs";

export type SubscriptionEntityNewParams = {
  id?: string;
  clientId: string;
  pubSubKey: string;
  subscriber: RedisClientType;
};

export class SubscriptionEntity extends Entity<string> {
  @IsString()
  private clientId: string;

  @IsString()
  private pubSubKey: string;

  @IsObject()
  private subscriber: RedisClientType;

  constructor(params: SubscriptionEntityNewParams) {
    super();

    this.id = params.id || v4();
    this.clientId = params.clientId;
    this.pubSubKey = params.pubSubKey;
    this.subscriber = params.subscriber;
  }

  public getClientId(): string {
    return this.clientId;
  }

  public getPubsubId(): string {
    return this.pubSubKey;
  }

  public getSubscriber(): RedisClientType {
    return this.subscriber;
  }

  public static async new(params: SubscriptionEntityNewParams): Promise<SubscriptionEntity> {
    const entity: SubscriptionEntity = new SubscriptionEntity(params);
    await entity.validate();
    return entity;
  }
}

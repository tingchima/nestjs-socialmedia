import { Entity } from "@repo/nestjs-libs";
import { IsArray, IsString } from "class-validator";
import { v4 } from "uuid";

export type SubscriptionEntityNewParams = {
  id?: string;
  clientId: string;
  channelIds: number[];
};

export class SubscriptionEntity extends Entity<string> {
  @IsString()
  private clientId: string;

  @IsArray()
  private channelIds: number[];

  constructor(params: SubscriptionEntityNewParams) {
    super();

    this.id = params.id || v4();
    this.clientId = params.clientId;
    this.channelIds = params.channelIds;
  }

  public getClientId(): string {
    return this.clientId;
  }

  public getChannelIds(): number[] {
    return this.channelIds;
  }

  public static async new(params: SubscriptionEntityNewParams): Promise<SubscriptionEntity> {
    const entity: SubscriptionEntity = new SubscriptionEntity(params);
    await entity.validate();
    return entity;
  }
}

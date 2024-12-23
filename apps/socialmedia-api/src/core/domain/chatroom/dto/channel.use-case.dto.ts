import { Exclude, Expose, plainToClass } from "class-transformer";

import { ChannelEntity } from "@core/domain/chatroom/entity/channel.entity";
import { SubscriptionEntity } from "@core/domain/chatroom/entity/subscription.entity";

@Exclude()
export class ChannelUseCaseDto {
  @Expose()
  public id: number;

  @Expose()
  public displayName: string;

  @Expose()
  public avatarPath: string;

  @Expose()
  public createdAt: Date;

  @Expose()
  public updatedAt: Date;

  public static newFromChannel(entity: ChannelEntity): ChannelUseCaseDto {
    return plainToClass(ChannelUseCaseDto, entity);
  }

  public static newListFromChannels(entities: ChannelEntity[]): ChannelUseCaseDto[] {
    return entities.map((entity) => this.newFromChannel(entity));
  }
}

@Exclude()
export class SubscriptionUseCaseDto {
  @Expose()
  public clientId: string;

  @Expose()
  public channelIds: number[];

  public static newFromSubscription(entity: SubscriptionEntity): SubscriptionUseCaseDto {
    return plainToClass(SubscriptionUseCaseDto, entity);
  }
}

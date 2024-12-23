import { Inject, Injectable } from "@nestjs/common";
import { RedisClientType } from "redis";

import { AppException, InternalServerError, RedisInjectTokens } from "@repo/nestjs-libs";
import { SubscriptionRepositoryPort } from "@core/domain/chatroom/interface/subscription.repository.port";

@Injectable()
export class SubscriptionRepositoryAdapter implements SubscriptionRepositoryPort {
  constructor(@Inject(RedisInjectTokens.REDIS_CLIENT) private readonly client: RedisClientType) {}

  private getKey(channelId: number): string {
    return `subscriptions:channels/${channelId}`;
  }

  public async createSubscription(
    by: { channelId: number; node: string },
    expiresIn: number,
  ): Promise<void> {
    const key = this.getKey(by.channelId);

    try {
      await this.client.sAdd(key, by.node);
      await this.client.expire(key, expiresIn);
    } catch (err: any) {
      throw AppException.new({ code: InternalServerError, cause: err });
    }
  }

  public async getSubscriptionList(by: { channelId: number }): Promise<string[]> {
    try {
      return await this.client.SMEMBERS(this.getKey(by.channelId));
    } catch (err: any) {
      throw AppException.new({ code: InternalServerError, cause: err });
    }
  }

  public async deleteSubscription(by: { channelId: number; wsGatewayUrl: string }): Promise<void> {
    try {
      await this.client.SREM(this.getKey(by.channelId), by.wsGatewayUrl);
    } catch (err: any) {
      throw AppException.new({ code: InternalServerError, cause: err });
    }
  }
}

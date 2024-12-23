import { Inject, Injectable } from "@nestjs/common";

import { AppException, InternalServerError, RedisInjectTokens } from "@repo/nestjs-libs";
import { SubscriptionRepositoryPort } from "@core/domain/chatroom/interface/subscription.repository.port";
import { RedisClientType } from "redis";

@Injectable()
export class SubscriptionRepositoryAdapter implements SubscriptionRepositoryPort {
  constructor(@Inject(RedisInjectTokens.REDIS_CLIENT) private readonly client: RedisClientType) {}

  private getSubscriptionKey(topic: string): string {
    return `subscriptions:channels/${topic}`;
  }

  private getPubSubKey(clientId: string): string {
    return `pubsubs:clients/${clientId}`;
  }

  public async createSubscription(
    by: { topic: string; clientId: string },
    expiresIn: number,
  ): Promise<void> {
    const key = this.getSubscriptionKey(by.topic);

    try {
      await this.client.SADD(key, by.clientId);
      await this.client.EXPIRE(key, expiresIn);
    } catch (err: any) {
      throw AppException.new({ code: InternalServerError, cause: err });
    }
  }

  public async getClientIdList(by: { topic: string }): Promise<string[]> {
    try {
      return await this.client.SMEMBERS(this.getSubscriptionKey(by.topic));
    } catch (err: any) {
      throw AppException.new({ code: InternalServerError, cause: err });
    }
  }

  public async deleteSubscription(by: { topic: string; clientId: string }): Promise<void> {
    try {
      await this.client.SREM(this.getSubscriptionKey(by.topic), by.clientId);
    } catch (err: any) {
      throw AppException.new({ code: InternalServerError, cause: err });
    }
  }

  public async createSubscriber(by: {
    clientId: string;
  }): Promise<{ pubSubKey: string; subscriber: RedisClientType }> {
    try {
      const pubSubKey = this.getPubSubKey(by.clientId);

      await this.client.SET(pubSubKey, new Date().toISOString());

      return { pubSubKey, subscriber: this.client.duplicate() };
    } catch (err: any) {
      throw AppException.new({ code: InternalServerError, cause: err });
    }
  }

  public async deleteSubscriber(by: { clientId: string }): Promise<void> {
    try {
      await this.client.DEL(this.getPubSubKey(by.clientId));
    } catch (err: any) {
      throw AppException.new({ code: InternalServerError, cause: err });
    }
  }

  public async publish(by: { clientId: string; chat: any }): Promise<void> {
    try {
      await this.client.publish(this.getPubSubKey(by.clientId), JSON.stringify(by.chat));
    } catch (err: any) {
      throw AppException.new({ code: InternalServerError, cause: err });
    }
  }
}

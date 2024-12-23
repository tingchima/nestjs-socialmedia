import { RedisClientType } from "redis";

export interface SubscriptionRepositoryPort {
  createSubscription(by: { topic: string; clientId: string }, expiresIn: number): Promise<void>;

  getClientIdList(by: { topic: string }): Promise<string[]>;

  deleteSubscription(by: { topic: string; clientId: string }): Promise<void>;

  createSubscriber(by: {
    clientId: string;
  }): Promise<{ pubSubKey: string; subscriber: RedisClientType }>;

  deleteSubscriber(by: { clientId: string }): Promise<void>;

  publish(by: { clientId: string; chat: any }): Promise<void>;
}

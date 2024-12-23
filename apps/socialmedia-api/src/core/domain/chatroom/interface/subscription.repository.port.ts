export interface SubscriptionRepositoryPort {
  createSubscription(by: { channelId: number; node: string }, expiresIn: number): Promise<void>;

  getSubscriptionList(by: { channelId: number }): Promise<string[]>;

  deleteSubscription(by: { channelId: number; wsGatewayUrl: string }): Promise<void>;
}

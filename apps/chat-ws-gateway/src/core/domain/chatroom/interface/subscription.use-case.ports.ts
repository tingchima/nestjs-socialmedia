export interface SubscriptionCreatePort {
  clientId: string;
  email: string;
  token: string;
}

export interface SubscriptionDeletePort {
  clientId: string;
}

export interface TopicSubscribePort {
  clientId: string;
  topic: string;
}

export interface TopicSubscribeBulkPort {
  subscribes: TopicSubscribePort[];
}

import {
  SubscriptionDeletePort,
  SubscriptionCreatePort,
  TopicSubscribeBulkPort,
} from "@core/domain/chatroom/interface/subscription.use-case.ports";
import { SubscriptionUseCaseDto } from "../dto/subscription.use-case.dto";

export interface SubscriptionUseCase {
  createSubscription(params: SubscriptionCreatePort): Promise<SubscriptionUseCaseDto>;

  deleteSubscription(params: SubscriptionDeletePort): Promise<void>;

  subscribeBulkTopic(params: TopicSubscribeBulkPort): Promise<void>;
}

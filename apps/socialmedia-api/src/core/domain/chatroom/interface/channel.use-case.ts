import { ChannelUseCaseDto } from "@core/domain/chatroom/dto/channel.use-case.dto";
import {
  ChannelCreatePort,
  ChannelGetPort,
  SubscriptionCreatePort,
  SubscriptionDeletePort,
} from "@core/domain/chatroom/interface/channel.use-case.ports";

export interface ChannelUseCase {
  createChannel(params: ChannelCreatePort): Promise<ChannelUseCaseDto>;

  getChannel(params: ChannelGetPort): Promise<ChannelUseCaseDto>;

  createSubscription(params: SubscriptionCreatePort): Promise<void>;

  deleteSubscription(params: SubscriptionDeletePort): Promise<void>;
}

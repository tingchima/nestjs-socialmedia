import { ChannelType } from "@core/domain/chatroom/entity/enum/channel.type";

export interface ChannelCreatePort {
  displayName: string;
  type: ChannelType;
  avatarPath?: string;
}

export interface ChannelGetPort {
  channelId: number;
  userId: number;
}

export interface SubscriptionCreatePort {
  node: string;
  clientId: string;
  userEmail: string;
  accessToken: string;
}

export interface SubscriptionDeletePort {
  clientId: string;
}

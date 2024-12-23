import { Scrolling } from "@core/domain/chatroom/entity/enum/scrolling";
import { Order } from "@repo/nestjs-libs";

export interface ChatCreatePort {
  channelId: number;
  senderId: number;
  text: string;
}

export interface ChatGetPort {
  id: number;
  channelId: number;
  senderId: number;
}

export interface ChatGetListPort {
  channelId: number;
  startId: number;
  endId?: number;
  perPage: number;
  scrolling: Scrolling;
  userId: number;
}

export interface ChatRemovePort {
  ids: number[];
  isAll: boolean;
  channelId: number;
  userId: number;
}

export interface ChatRetractPort {
  ids: number[];
  channelId: number;
  userId: number;
}

export interface ChatOnPublishUpdatePort {
  channelId: number;
  createdAt: Date;
  publishAt: Date;
}

export interface ChatOnDeliveredUpdatePort {
  channelId: number;
  createdAt: Date;
  deliveredAt: Date;
}

export interface ChatOnAckedUpdatePort {
  channelId: number;
  createdAt: Date;
  ackedAt: Date;
}

export interface ChatSearchListPort {
  channelId: number;
  search: string;
  page: number;
  perPage: number;
  userId: number;
  order: Order;
}

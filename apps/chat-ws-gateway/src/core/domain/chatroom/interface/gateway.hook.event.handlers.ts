import { EventHandler } from "@repo/nestjs-libs";

import {
  OnChatAckedEvent,
  OnChatDeliveredEvent,
  OnChatPublishEvent,
  OnClientConnectedEvent,
  OnClientDisconnectedEvent,
} from "@core/domain/chatroom/event/gateway.hook.events";

export type OnClientConnectedEventHandler = EventHandler<OnClientConnectedEvent>;

export type OnClientDisconnectedEventHandler = EventHandler<OnClientDisconnectedEvent>;

export type OnChatPublishEventHandler = EventHandler<OnChatPublishEvent>;

export type OnChatDeliveredEventHandler = EventHandler<OnChatDeliveredEvent>;

export type OnChatAckedEventHandler = EventHandler<OnChatAckedEvent>;

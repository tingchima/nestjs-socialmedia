import { Inject, Injectable } from "@nestjs/common";
import { EventsHandler, IEventHandler } from "@nestjs/cqrs";

import { ChatroomInjectTokens } from "@core/domain/chatroom/chatroom.inject.tokens";
import {
  OnChatAckedEventHandler,
  OnChatDeliveredEventHandler,
  OnChatPublishEventHandler,
  OnClientConnectedEventHandler,
  OnClientDisconnectedEventHandler,
} from "@core/domain/chatroom/interface/gateway.hook.event.handlers";
import {
  OnChatAckedEvent,
  OnChatDeliveredEvent,
  OnChatPublishEvent,
  OnClientConnectedEvent,
  OnClientDisconnectedEvent,
} from "@core/domain/chatroom/event/gateway.hook.events";

@Injectable()
@EventsHandler(OnClientConnectedEvent)
export class CqrsOnClientConnectedEventHandler implements IEventHandler {
  constructor(
    @Inject(ChatroomInjectTokens.ON_CLIENT_CONNECTED_EVENT_HANDLER)
    private readonly handler: OnClientConnectedEventHandler,
  ) {}

  public async handle(event: OnClientConnectedEvent): Promise<void> {
    return this.handler.handle(event);
  }
}

@Injectable()
@EventsHandler(OnClientDisconnectedEvent)
export class CqrsOnClientDisconnectedEventHandler implements IEventHandler {
  constructor(
    @Inject(ChatroomInjectTokens.ON_CLIENT_DISCONNECTED_EVENT_HANDLER)
    private readonly handler: OnClientDisconnectedEventHandler,
  ) {}

  public async handle(event: OnClientDisconnectedEvent): Promise<void> {
    return this.handler.handle(event);
  }
}

@Injectable()
@EventsHandler(OnChatAckedEvent)
export class CqrsOnChatAckedEventHandler implements IEventHandler {
  constructor(
    @Inject(ChatroomInjectTokens.ON_CHAT_ACKED_EVENT_HANDLER)
    private readonly handler: OnChatAckedEventHandler,
  ) {}

  public async handle(event: OnChatAckedEvent): Promise<void> {
    return this.handler.handle(event);
  }
}

@Injectable()
@EventsHandler(OnChatPublishEvent)
export class CqrsOnChatPublishEventHandler implements IEventHandler {
  constructor(
    @Inject(ChatroomInjectTokens.ON_CHAT_PUBLISH_EVENT_HANDLER)
    private readonly handler: OnChatPublishEventHandler,
  ) {}

  public async handle(event: OnChatPublishEvent): Promise<void> {
    return this.handler.handle(event);
  }
}

@Injectable()
@EventsHandler(OnChatDeliveredEvent)
export class CqrsOnChatDeliveredEventHandler implements IEventHandler {
  constructor(
    @Inject(ChatroomInjectTokens.ON_CHAT_DELIVERED_EVENT_HANDLER)
    private readonly handler: OnChatDeliveredEventHandler,
  ) {}

  public async handle(event: OnChatDeliveredEvent): Promise<void> {
    return this.handler.handle(event);
  }
}

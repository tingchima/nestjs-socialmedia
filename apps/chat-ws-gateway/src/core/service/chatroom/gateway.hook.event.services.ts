import { Inject } from "@nestjs/common";

import {
  OnChatAckedEventHandler,
  OnChatDeliveredEventHandler,
  OnChatPublishEventHandler,
  OnClientConnectedEventHandler,
  OnClientDisconnectedEventHandler,
} from "@core/domain/chatroom/interface/gateway.hook.event.handlers";
import { ChatroomInjectTokens } from "@core/domain/chatroom/chatroom.inject.tokens";
import { GatewayHookServiceClientService } from "@infrastructure/adapter/server/grpc/gateway.hook.service.client.service";
import {
  OnChatAckedEvent,
  OnChatDeliveredEvent,
  OnChatPublishEvent,
  OnClientConnectedEvent,
  OnClientDisconnectedEvent,
} from "@core/domain/chatroom/event/gateway.hook.events";
import { GatewayHookServiceV1 as pb, dateToProtobufTimestamp } from "@repo/grpc";

export class OnClientConnectedEventService implements OnClientConnectedEventHandler {
  constructor(
    @Inject(ChatroomInjectTokens.GATEWAY_HOOK_SERVICE_CLIENT_SERVICE)
    private readonly serviceClientService: GatewayHookServiceClientService,
  ) {}

  public async handle(event: OnClientConnectedEvent): Promise<void> {
    const request = {
      clientInfo: event.clientInfo,
    } as pb.OnClientConnectedRequest;

    this.serviceClientService.onClientConnected(request).subscribe();
  }
}

export class OnClinetDisconnectedEventService implements OnClientDisconnectedEventHandler {
  constructor(
    @Inject(ChatroomInjectTokens.GATEWAY_HOOK_SERVICE_CLIENT_SERVICE)
    private readonly serviceClientService: GatewayHookServiceClientService,
  ) {}

  public async handle(event: OnClientDisconnectedEvent): Promise<void> {
    const request = {
      clientInfo: event.clientInfo,
    } as pb.OnClientDisconnectedRequest;

    this.serviceClientService.onClientDisconnected(request).subscribe();
  }
}

export class OnChatPublishEventService implements OnChatPublishEventHandler {
  constructor(
    @Inject(ChatroomInjectTokens.GATEWAY_HOOK_SERVICE_CLIENT_SERVICE)
    private readonly serviceClientService: GatewayHookServiceClientService,
  ) {}

  public async handle(event: OnChatPublishEvent): Promise<void> {
    const request = {
      publishAt: dateToProtobufTimestamp(event.publishAt),
      channelId: event.channelId,
      chatCreatedAt: dateToProtobufTimestamp(event.chatCreatedAt),
    };
    this.serviceClientService.onChatPublish(request).subscribe();
  }
}

export class OnChatDeliberedEventService implements OnChatDeliveredEventHandler {
  constructor(
    @Inject(ChatroomInjectTokens.GATEWAY_HOOK_SERVICE_CLIENT_SERVICE)
    private readonly serviceClientService: GatewayHookServiceClientService,
  ) {}

  public async handle(event: OnChatDeliveredEvent): Promise<void> {
    const request = {
      deliveredAt: dateToProtobufTimestamp(event.deliveredAt),
      channelId: event.channelId,
      chatCreatedAt: dateToProtobufTimestamp(event.chatCreatedAt),
    };
    this.serviceClientService.onChatDelivered(request).subscribe();
  }
}

export class OnChatAckedEventService implements OnChatAckedEventHandler {
  constructor(
    @Inject(ChatroomInjectTokens.GATEWAY_HOOK_SERVICE_CLIENT_SERVICE)
    private readonly serviceClientService: GatewayHookServiceClientService,
  ) {}

  public async handle(event: OnChatAckedEvent): Promise<void> {
    const request = {
      ackedAt: dateToProtobufTimestamp(event.ackedAt),
      channelId: event.channelId,
      chatCreatedAt: dateToProtobufTimestamp(event.chatCreatedAt),
    };
    this.serviceClientService.onChatAcked(request).subscribe();
  }
}

import { Module, Provider } from "@nestjs/common";

import { ChatroomInjectTokens } from "@core/domain/chatroom/chatroom.inject.tokens";
import { CahtEventsGateway } from "@application/event-gateway/chat.event.gateway";
import { ChatService } from "@core/service/chatroom/chat.service";
import {
  OnChatAckedEventService,
  OnChatDeliberedEventService,
  OnChatPublishEventService,
  OnClientConnectedEventService,
  OnClinetDisconnectedEventService,
} from "@core/service/chatroom/gateway.hook.event.services";
import {
  CqrsOnChatAckedEventHandler,
  CqrsOnChatDeliveredEventHandler,
  CqrsOnChatPublishEventHandler,
  CqrsOnClientConnectedEventHandler,
  CqrsOnClientDisconnectedEventHandler,
} from "@infrastructure/handler/chatroom/cqrs.gateway.hook.event.handlers";
import { SubscriptionRepositoryAdapter } from "@infrastructure/adapter/cache/keyv/repository/subscription.repository.adapter";
import { SubscriptionService } from "@core/service/chatroom/subscription.service";
import { GatewayHookServiceClientService } from "@infrastructure/adapter/server/grpc/gateway.hook.service.client.service";
import { ConfigModule } from "@repo/nestjs-libs";
import { GrpcChatServiceController } from "@application/api-route/grpc/v1/grpc.chat.service.controller";

const cacheProviders: Provider[] = [
  {
    provide: ChatroomInjectTokens.SUBSCRIPTION_REPOSITORY,
    useClass: SubscriptionRepositoryAdapter,
  },
];

const serverProviders: Provider[] = [
  {
    provide: ChatroomInjectTokens.GATEWAY_HOOK_SERVICE_CLIENT_SERVICE,
    useClass: GatewayHookServiceClientService,
  },
];

const useCaseProviders: Provider[] = [
  {
    provide: ChatroomInjectTokens.CHAT_USE_CASE,
    useClass: ChatService,
  },
  {
    provide: ChatroomInjectTokens.SUBSCRIPTION_USE_CASE,
    useClass: SubscriptionService,
  },
];

const handlerProviders: Provider[] = [
  {
    provide: ChatroomInjectTokens.ON_CLIENT_CONNECTED_EVENT_HANDLER,
    useClass: OnClientConnectedEventService,
  },
  {
    provide: CqrsOnClientConnectedEventHandler,
    useClass: CqrsOnClientConnectedEventHandler,
  },
  {
    provide: ChatroomInjectTokens.ON_CLIENT_DISCONNECTED_EVENT_HANDLER,
    useClass: OnClinetDisconnectedEventService,
  },
  {
    provide: CqrsOnClientDisconnectedEventHandler,
    useClass: CqrsOnClientDisconnectedEventHandler,
  },
  {
    provide: ChatroomInjectTokens.ON_CHAT_PUBLISH_EVENT_HANDLER,
    useClass: OnChatPublishEventService,
  },
  {
    provide: CqrsOnChatPublishEventHandler,
    useClass: CqrsOnChatPublishEventHandler,
  },
  {
    provide: ChatroomInjectTokens.ON_CHAT_DELIVERED_EVENT_HANDLER,
    useClass: OnChatDeliberedEventService,
  },
  {
    provide: CqrsOnChatDeliveredEventHandler,
    useClass: CqrsOnChatDeliveredEventHandler,
  },
  {
    provide: ChatroomInjectTokens.ON_CHAT_ACKED_EVENT_HANDLER,
    useClass: OnChatAckedEventService,
  },
  {
    provide: CqrsOnChatAckedEventHandler,
    useClass: CqrsOnChatAckedEventHandler,
  },
];

const eventGatewayProviders: Provider[] = [CahtEventsGateway];

@Module({
  imports: [ConfigModule],
  controllers: [GrpcChatServiceController],
  providers: [
    ...cacheProviders,
    ...serverProviders,
    ...useCaseProviders,
    ...handlerProviders,
    ...eventGatewayProviders,
  ],
})
export class ChatroomModule {}

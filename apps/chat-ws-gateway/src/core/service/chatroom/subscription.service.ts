import { Inject, Injectable } from "@nestjs/common";

import { ConfigServicePort, EventBusPort } from "@repo/nestjs-libs";
import { ChatroomInjectTokens } from "@core/domain/chatroom/chatroom.inject.tokens";
import { SubscriptionUseCase } from "@core/domain/chatroom/interface/subscription.use-case";
import {
  SubscriptionDeletePort,
  SubscriptionCreatePort,
  TopicSubscribeBulkPort,
} from "@core/domain/chatroom/interface/subscription.use-case.ports";
import { SubscriptionRepositoryPort } from "@core/domain/chatroom/interface/subscription.repository.port";
import { CqrsInjectTokens } from "@infrastructure/adapter/handler/cqrs.bus.inject.tokens";
import { OnClientDisconnectedEvent } from "@core/domain/chatroom/event/gateway.hook.events";
import { ClientInfo } from "@core/domain/chatroom/value-object/client.info.value-object";
import { SubscriptionEntity } from "@core/domain/chatroom/entity/subscription.entity";
import { SubscriptionUseCaseDto } from "@core/domain/chatroom/dto/subscription.use-case.dto";
import { GatewayHookServiceClientService } from "@infrastructure/adapter/server/grpc/gateway.hook.service.client.service";

import { GatewayHookServiceV1 as pb } from "@repo/grpc";

@Injectable()
export class SubscriptionService implements SubscriptionUseCase {
  constructor(
    @Inject(ChatroomInjectTokens.SUBSCRIPTION_REPOSITORY)
    private readonly subscriptionRepository: SubscriptionRepositoryPort,

    @Inject(CqrsInjectTokens.EVENT_BUS) private readonly eventBus: EventBusPort,

    @Inject(ChatroomInjectTokens.GATEWAY_HOOK_SERVICE_CLIENT_SERVICE)
    private readonly serviceClientService: GatewayHookServiceClientService,

    private readonly configService: ConfigServicePort,
  ) {}

  public async createSubscription(params: SubscriptionCreatePort): Promise<SubscriptionUseCaseDto> {
    const clientInfo: ClientInfo = await ClientInfo.new({
      node: `localhost:${this.configService.GRPC_PORT}`,
      clientId: params.clientId,
      email: params.email,
      token: params.token,
    });

    this.serviceClientService
      .onClientConnected({
        clientInfo,
      } as pb.OnClientConnectedRequest)
      .subscribe(() => {
        console.log("onClientConnected...completed");
      });

    const { pubSubKey, subscriber } = await this.subscriptionRepository.createSubscriber({
      clientId: params.clientId,
    });

    const subscription: SubscriptionEntity = await SubscriptionEntity.new({
      clientId: params.clientId,
      subscriber,
      pubSubKey,
    });

    return SubscriptionUseCaseDto.newFromSubscription(subscription);
  }

  public async deleteSubscription(params: SubscriptionDeletePort): Promise<void> {
    const clientInfo: ClientInfo = await ClientInfo.new({
      clientId: params.clientId,
    });

    this.eventBus.sendEvent(OnClientDisconnectedEvent.new(clientInfo));

    await this.subscriptionRepository.deleteSubscriber({ clientId: clientInfo.clientId });
  }

  public async subscribeBulkTopic(params: TopicSubscribeBulkPort): Promise<void> {
    params.subscribes.forEach(async (subscribe) => {
      await this.subscriptionRepository.createSubscription(
        {
          topic: subscribe.topic,
          clientId: subscribe.clientId,
        },
        3600,
      );
    });
  }
}

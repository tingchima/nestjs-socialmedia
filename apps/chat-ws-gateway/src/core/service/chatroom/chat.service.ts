import { Inject, Injectable } from "@nestjs/common";

import { ChatUseCase } from "@core/domain/chatroom/interface/chat.use-case";
import { ChatroomInjectTokens } from "@core/domain/chatroom/chatroom.inject.tokens";
import { SubscriptionRepositoryAdapter } from "@infrastructure/adapter/cache/keyv/repository/subscription.repository.adapter";
import {
  ChatPublishPort,
  ChatOnAckedPort,
  ChatOnDeliveredPort,
} from "@core/domain/chatroom/interface/chat.use-case.port";
import { CqrsInjectTokens } from "@infrastructure/adapter/handler/cqrs.bus.inject.tokens";
import { EventBusPort } from "@repo/nestjs-libs";
import {
  OnChatAckedEvent,
  OnChatDeliveredEvent,
  OnChatPublishEvent,
} from "@core/domain/chatroom/event/gateway.hook.events";

@Injectable()
export class ChatService implements ChatUseCase {
  constructor(
    @Inject(ChatroomInjectTokens.SUBSCRIPTION_REPOSITORY)
    private readonly subscriptionRepository: SubscriptionRepositoryAdapter,

    @Inject(CqrsInjectTokens.EVENT_BUS) private readonly eventBus: EventBusPort,
  ) {}

  public async publishChat(params: ChatPublishPort): Promise<void> {
    const clinetIds: string[] = await this.subscriptionRepository.getClientIdList({
      topic: params.channelId.toString(),
    });

    clinetIds.forEach(async (clientId) => {
      this.eventBus.sendEvent(
        OnChatPublishEvent.new({
          channelId: params.chat.channelId,
          chatCreatedAt: params.chat.createdAt,
          publishAt: new Date(),
        }),
      );

      await this.subscriptionRepository.publish({ clientId, chat: params.chat });
    });
  }

  public async onChatDelivered(params: ChatOnDeliveredPort): Promise<void> {
    const chat = JSON.parse(params.chat);

    this.eventBus.sendEvent(
      OnChatDeliveredEvent.new({
        channelId: chat.channelId,
        chatCreatedAt: new Date(chat.createdAt),
        deliveredAt: params.deliveredAt,
      }),
    );
  }

  public async onChatAcked(params: ChatOnAckedPort): Promise<void> {
    this.eventBus.sendEvent(
      OnChatAckedEvent.new({
        channelId: params.channelId,
        chatCreatedAt: params.chatCreatedAt,
        ackedAt: params.ackedAt,
      }),
    );
  }
}

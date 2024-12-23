import { Inject, Injectable } from "@nestjs/common";

import { ChatUseCase } from "@core/domain/chatroom/interface/chat.use-case";
import { ChatUseCaseDto } from "@core/domain/chatroom/dto/chat.use-case.dto";
import {
  ChatCreatePort,
  ChatGetListPort,
  ChatGetPort,
  ChatOnAckedUpdatePort,
  ChatOnDeliveredUpdatePort,
  ChatOnPublishUpdatePort,
  ChatRemovePort,
  ChatRetractPort,
  ChatSearchListPort,
} from "@core/domain/chatroom/interface/chat.use-case.ports";
import { ChatRepositoryPort } from "@core/domain/chatroom/interface/chat.repository.port";
import { ChatroomInjectTokens } from "@core/domain/chatroom/chatroom.inject.tokens";
import { ChatEntity } from "@core/domain/chatroom/entity/chat.entity";
import { AppException, Optional, Order, ResourceNotFound } from "@repo/nestjs-libs";
import { Scrolling } from "@core/domain/chatroom/entity/enum/scrolling";
import { KnexMemberRepositoryAdapter } from "@infrastructure/adapter/persistence/knex/repository/knex.member.repository.adapter";
import { dateToProtobufTimestamp, ChatServiceV1 as pb } from "@repo/grpc";
import { ReplaySubject } from "rxjs";
import { ChatServiceClientManager } from "@infrastructure/adapter/server/grpc/chat.service.client.service";
import { WsGatewayLocationRepositoryAdapter } from "@infrastructure/adapter/cache/redis/repository/ws.gateway.location.repository.adapter";
import { MemberExistsHelperService } from "./helper/member.exists.helper.service";
import { ChatSearchRepositoryPort } from "@core/domain/chatroom/interface/chat.search.repository.port";

@Injectable()
export class ChatService implements ChatUseCase {
  constructor(
    @Inject(ChatroomInjectTokens.CHAT_REPOSITORY)
    private readonly chatRepository: ChatRepositoryPort,

    @Inject(ChatroomInjectTokens.MEMBER_REPOSITORY)
    private readonly memberRepository: KnexMemberRepositoryAdapter,

    @Inject(ChatroomInjectTokens.CHAT_SEARCH_REPOSITORY)
    private readonly chatSearchRepository: ChatSearchRepositoryPort,

    @Inject(ChatroomInjectTokens.WS_CLIENT_REPOSITORY)
    private readonly wsClietnRepository: WsGatewayLocationRepositoryAdapter,

    @Inject(ChatroomInjectTokens.CHAT_SEVICE_CLIENT_MANAGER)
    private readonly chatServiceManager: ChatServiceClientManager,

    private readonly memberExistsHelperService: MemberExistsHelperService,
  ) {}

  public async createChat(params: ChatCreatePort): Promise<ChatUseCaseDto> {
    await this.memberExistsHelperService.resolve({
      channelId: params.channelId,
      userId: params.senderId,
    });

    const userIds: number[] = await this.memberRepository.findUserIds({
      channelId: params.channelId,
    });

    const chat: ChatEntity = await ChatEntity.new({
      channelId: params.channelId,
      senderId: params.senderId,
      text: params.text,
    });

    const newMesage: ChatEntity = await this.chatRepository.createChat(chat);

    const wsLocationSymbols = await this.wsClietnRepository.getLocationList({
      clientIds: userIds.map((userId) => `clientid_${userId}`),
    });

    /**
     * Public chat to each ws gateway location to specifed users
     */
    wsLocationSymbols.forEach((wsLocationSymbol) => {
      const requests$ = new ReplaySubject<pb.PublishChatRequest>();
      requests$.next({
        channelId: newMesage.getChannelId(),
        chat: {
          channelId: newMesage.getChannelId(),
          text: newMesage.getText() || "",
          createdAt: dateToProtobufTimestamp(newMesage.getCreatedAt()),
        },
      } as pb.PublishChatRequest);
      requests$.complete();

      this.chatServiceManager.publishChat(wsLocationSymbol, requests$).subscribe((resp) => {
        console.log(`reply status=${resp.publishStatus} from ${Symbol.keyFor(wsLocationSymbol)}`);
      });
    });

    return ChatUseCaseDto.newFromChat(newMesage);
  }

  public async getChat(params: ChatGetPort): Promise<ChatUseCaseDto> {
    await this.memberExistsHelperService.resolve({
      channelId: params.channelId,
      userId: params.senderId,
    });

    const chat = await this.chatRepository.findChat({
      channelId: params.channelId,
      createdAt: new Date(params.id),
    });
    if (!chat) {
      throw AppException.new({
        code: ResourceNotFound,
        clientMessage: `specified chat ${params.id} is not found`,
      });
    }

    return ChatUseCaseDto.newFromChat(chat);
  }

  public async getChatList(
    params: ChatGetListPort,
  ): Promise<{ chats: ChatUseCaseDto[]; lastTokenId: number }> {
    await this.memberExistsHelperService.resolve({
      channelId: params.channelId,
      userId: params.userId,
    });

    const { chats, lastChatId } = await this.chatRepository.findChats(
      {
        channelId: params.channelId,
        startId: params.startId,
        endId: params.endId,
        ignoredUserId: params.userId,
      },
      {
        limit: params.perPage,
        orderBy: {
          order: params.scrolling === Scrolling.UP ? Order.DESC : Order.ASC,
        },
      },
    );

    return { chats: ChatUseCaseDto.newListFromChats(chats), lastTokenId: lastChatId };
  }

  public async removeChat(params: ChatRemovePort): Promise<void> {
    await this.memberExistsHelperService.resolve({
      channelId: params.channelId,
      userId: params.userId,
    });

    await this.chatRepository.batchUpdateIgnoredUser({
      channelId: params.channelId,
      createdAts: params.ids.map((id) => new Date(id)),
      userId: params.userId,
    });
  }

  public async retractChat(params: ChatRetractPort): Promise<void> {
    await this.memberExistsHelperService.resolve({
      channelId: params.channelId,
      userId: params.userId,
    });

    const createdAts = params.ids.map((id) => new Date(id));

    createdAts.forEach(async (createdAt) => {
      const chat: Optional<ChatEntity> = await this.chatRepository.findChat({
        channelId: params.channelId,
        createdAt,
      });

      if (!chat) {
        throw AppException.new({
          code: ResourceNotFound,
          clientMessage: `specified chat ${params.ids[0]} is not found`,
        });
      }

      await chat.edit({ isRetract: true });

      await this.chatRepository.updateChat(chat);
    });
  }

  public async updateChatOnPublish(params: ChatOnPublishUpdatePort): Promise<void> {
    await this.chatRepository.updateChatOnPublish({
      channelId: params.channelId,
      createdAt: params.createdAt,
      publishAt: params.publishAt,
    });
  }

  public async updateChatOnDelivered(params: ChatOnDeliveredUpdatePort): Promise<void> {
    await this.chatRepository.updateChatOnDeliveredAt({
      channelId: params.channelId,
      createdAt: params.createdAt,
      deliveredAt: params.deliveredAt,
    });
  }

  public async updateChatOnAcked(params: ChatOnAckedUpdatePort): Promise<void> {
    await this.chatRepository.updateChatOnAcked({
      channelId: params.channelId,
      createdAt: params.createdAt,
      ackedAt: params.ackedAt,
    });
  }

  public async searchChatList(
    params: ChatSearchListPort,
  ): Promise<{ chats: ChatUseCaseDto[]; total: number }> {
    const { chats, total } = await this.chatSearchRepository.searchChatList(
      {
        channelId: params.channelId,
        search: params.search,
        ignoredUserId: params.userId,
      },
      { offset: params.page, orderBy: { order: params.order } },
    );

    return { chats: ChatUseCaseDto.newListFromChats(chats), total };
  }
}

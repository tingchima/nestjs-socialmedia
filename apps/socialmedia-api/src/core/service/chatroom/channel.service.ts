import { Inject, Injectable } from "@nestjs/common";

import { ChannelUseCaseDto } from "@core/domain/chatroom/dto/channel.use-case.dto";
import { ChannelUseCase } from "@core/domain/chatroom/interface/channel.use-case";
import {
  ChannelCreatePort,
  ChannelGetPort,
  SubscriptionCreatePort,
  SubscriptionDeletePort,
} from "@core/domain/chatroom/interface/channel.use-case.ports";
import { KnexChannelRepositoryAdapter } from "@infrastructure/adapter/persistence/knex/repository/knex.channel.repository.adapter";
import { ChatroomInjectTokens } from "@core/domain/chatroom/chatroom.inject.tokens";
import { ChannelEntity } from "@core/domain/chatroom/entity/channel.entity";
import { AppException, Optional, ResourceNotFound } from "@repo/nestjs-libs";
import { KnexMemberRepositoryAdapter } from "@infrastructure/adapter/persistence/knex/repository/knex.member.repository.adapter";
import { WsGatewayLocationRepositoryAdapter } from "@infrastructure/adapter/cache/redis/repository/ws.gateway.location.repository.adapter";
import { ChatServiceV1 as pb } from "@repo/grpc";
import { ChatServiceClientManager } from "@infrastructure/adapter/server/grpc/chat.service.client.service";
import { WsLocationKeyNameHelperService } from "./helper/ws.location.key.name.helper.service";
import { MemberExistsHelperService } from "./helper/member.exists.helper.service";

@Injectable()
export class ChannelService implements ChannelUseCase {
  constructor(
    @Inject(ChatroomInjectTokens.CHANNEL_REPOSITORY)
    private readonly channelRepository: KnexChannelRepositoryAdapter,

    @Inject(ChatroomInjectTokens.MEMBER_REPOSITORY)
    private readonly memberRepository: KnexMemberRepositoryAdapter,

    @Inject(ChatroomInjectTokens.WS_CLIENT_REPOSITORY)
    private readonly wsLocationRepository: WsGatewayLocationRepositoryAdapter,

    @Inject(ChatroomInjectTokens.CHAT_SEVICE_CLIENT_MANAGER)
    private readonly chatServiceManager: ChatServiceClientManager,

    private readonly wsLocationKeyNameService: WsLocationKeyNameHelperService,
    private readonly memberExistsHelperService: MemberExistsHelperService,
  ) {}

  public async createChannel(params: ChannelCreatePort): Promise<ChannelUseCaseDto> {
    const channel: ChannelEntity = await ChannelEntity.new({
      displayName: params.displayName,
      type: params.type,
    });

    const createdId: { id: number } = await this.channelRepository.create(channel);

    return ChannelUseCaseDto.newFromChannel(channel.buildId(createdId));
  }

  public async getChannel(params: ChannelGetPort): Promise<ChannelUseCaseDto> {
    await this.memberExistsHelperService.resolve({
      channelId: params.channelId,
      userId: params.userId,
    });

    const channel: Optional<ChannelEntity> = await this.channelRepository.findOneById(
      params.channelId,
    );
    if (!channel) {
      throw AppException.new({
        code: ResourceNotFound,
        clientMessage: `specified hannel is not found`,
      });
    }

    return ChannelUseCaseDto.newFromChannel(channel);
  }

  public async createSubscription(params: SubscriptionCreatePort): Promise<void> {
    const expiresIn = 3600; // TODO: use config

    const { location, locationSymbol } = this.wsLocationKeyNameService.resolve(params.node);

    await this.wsLocationRepository.createGatewayLocation(
      {
        clientId: params.clientId,
        location,
      },
      expiresIn,
    );

    let userId: number;

    const userIdSts = params.clientId.split("clientid_");

    if (userIdSts.length > 1) {
      userId = parseInt(userIdSts[1], 10);
    } else {
      userId = parseInt(userIdSts[0], 10);
    }

    const channelIds: number[] = await this.memberRepository.findChannelIds({ userId });

    const subscribes: pb.Subscribe[] = channelIds.map(
      (channelId) =>
        ({
          clientId: params.clientId,
          topic: channelId.toString(),
        }) as pb.Subscribe,
    );

    this.chatServiceManager.subscribeBulk(locationSymbol, { subscribes }).subscribe();
  }

  public async deleteSubscription(params: SubscriptionDeletePort): Promise<void> {
    await this.wsLocationRepository.deleteGatewayLocaiton({ clientId: params.clientId });
  }
}

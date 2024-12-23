import { Inject } from "@nestjs/common";
import { GrpcService } from "@nestjs/microservices";

import { ChatroomInjectTokens } from "@core/domain/chatroom/chatroom.inject.tokens";
import { ChannelUseCase } from "@core/domain/chatroom/interface/channel.use-case";
import {
  SubscriptionCreateAdapter,
  SubscriptionDeleteAdapter,
} from "@infrastructure/adapter/use-case/channel.use-case.adapters";
import { AppException, ParameterInvalid } from "@repo/nestjs-libs";
import { GatewayHookServiceV1 as pb, protobufTimestampToDate } from "@repo/grpc";
import { ChatUseCase } from "@core/domain/chatroom/interface/chat.use-case";
import {
  ChatOnAckedUpdateAdapter,
  ChatOnDeliveredUpdateAdapter,
  ChatOnPublishUpdateAdapter,
} from "@infrastructure/adapter/use-case/chat.use-case.adapters";
import Long from "long";

@GrpcService()
@pb.GatewayHookServiceControllerMethods()
export class GrpcGatewayHookServiceController implements pb.GatewayHookServiceController {
  constructor(
    @Inject(ChatroomInjectTokens.CHANNEL_USE_CASE)
    private readonly channelUseCae: ChannelUseCase,

    @Inject(ChatroomInjectTokens.CHAT_USE_CASE)
    private readonly chatUseCase: ChatUseCase,
  ) {}

  public async onClientConnected(request: pb.OnClientConnectedRequest) {
    const clientInfo = request.clientInfo;
    if (!clientInfo) {
      throw AppException.new({ code: ParameterInvalid, clientMessage: "client_info is empty" });
    }
    const adapter: SubscriptionCreateAdapter = await SubscriptionCreateAdapter.new({
      node: clientInfo.node,
      clientId: clientInfo.clientId,
      userEmail: clientInfo.userEmail,
      accessToken: clientInfo.accessToken,
    });
    await this.channelUseCae.createSubscription(adapter);
  }

  public async onClientDisconnected(request: pb.OnClientDisconnectedRequest) {
    const clientInfo = request.clientInfo;
    if (!clientInfo) {
      throw AppException.new({ code: ParameterInvalid, clientMessage: "client_info is empty" });
    }

    const adapter: SubscriptionDeleteAdapter = await SubscriptionDeleteAdapter.new({
      clientId: clientInfo.clientId,
    });

    await this.channelUseCae.deleteSubscription(adapter);
  }

  public async onChatPublish(request: pb.OnChatPublishRequest) {
    if (!request.chatCreatedAt || !request.publishAt) {
      throw AppException.new({
        code: ParameterInvalid,
        clientMessage: "the value of either chat_created_at or publish_at is empty",
      });
    }

    const adapter: ChatOnPublishUpdateAdapter = await ChatOnPublishUpdateAdapter.new({
      channelId: Long.fromValue(request.channelId).toNumber(),
      createdAt: protobufTimestampToDate(request.chatCreatedAt),
      publishAt: protobufTimestampToDate(request.publishAt),
    });

    await this.chatUseCase.updateChatOnPublish(adapter);
  }

  public async onChatDelivered(request: pb.OnChatDeliveredRequest) {
    if (!request.chatCreatedAt || !request.deliveredAt) {
      throw AppException.new({
        code: ParameterInvalid,
        clientMessage: "the value of either chat_created_at or delivered_at is empty",
      });
    }

    const adapter: ChatOnDeliveredUpdateAdapter = await ChatOnDeliveredUpdateAdapter.new({
      channelId: Long.fromValue(request.channelId).toNumber(),
      createdAt: protobufTimestampToDate(request.chatCreatedAt),
      deliveredAt: protobufTimestampToDate(request.deliveredAt),
    });

    await this.chatUseCase.updateChatOnDelivered(adapter);
  }

  public async onChatAcked(request: pb.OnChatAckedRequest) {
    if (!request.chatCreatedAt || !request.ackedAt) {
      throw AppException.new({
        code: ParameterInvalid,
        clientMessage: "the value of either chat_created_at or acked_at is empty",
      });
    }

    const adapter: ChatOnAckedUpdateAdapter = await ChatOnAckedUpdateAdapter.new({
      channelId: Long.fromValue(request.channelId).toNumber(),
      createdAt: protobufTimestampToDate(request.chatCreatedAt),
      ackedAt: protobufTimestampToDate(request.ackedAt),
    });

    await this.chatUseCase.updateChatOnAcked(adapter);
  }
}

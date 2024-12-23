import { SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Inject } from "@nestjs/common";
import { IncomingMessage } from "http";
import { Server, WebSocket } from "ws";

import { ChatroomInjectTokens } from "@core/domain/chatroom/chatroom.inject.tokens";
import {
  SubscriptionCreateAdapter,
  SubscriptionDeleteAdapter,
} from "@infrastructure/adapter/use-case/subscription.user-case.adapter";
import { SubscriptionUseCase } from "@core/domain/chatroom/interface/subscription.use-case";
import { SubscriptionUseCaseDto } from "@core/domain/chatroom/dto/subscription.use-case.dto";
import { ChatUseCase } from "@core/domain/chatroom/interface/chat.use-case";
import {
  ChatOnAckedAdapter,
  ChatOnDeliveredAdapter,
} from "@infrastructure/adapter/use-case/chat.use-case.adapter";

const clientStates = new Map();

@WebSocketGateway(3030)
export class CahtEventsGateway {
  @WebSocketServer()
  server: Server;

  constructor(
    @Inject(ChatroomInjectTokens.SUBSCRIPTION_USE_CASE)
    private readonly subscriptionUseCase: SubscriptionUseCase,

    @Inject(ChatroomInjectTokens.CHAT_USE_CASE)
    private readonly chatUseCase: ChatUseCase,
  ) {}

  afterInit() {}

  async handleConnection(socket: WebSocket, request: IncomingMessage) {
    if (!request.headers.authorization) {
      socket.send("authorization header is not found");
      return;
    }

    const authorizations = request.headers.authorization.split(" ");
    if (authorizations.length !== 2) {
      socket.send("bearer token is not found");
      return;
    }

    if (!request.url) {
      socket.send("bearer token is not found");
      return;
    }

    const params = request.url.split("&");

    if (params.length !== 2) {
      socket.send("specified parameters are not found");
      return;
    }

    const clientidParams = params[0].split("clientid=");
    if (params.length !== 2) {
      socket.send("clientid parameter is not found");
      return;
    }

    const emailParams = params[1].split("email=");
    if (params.length !== 2) {
      socket.send("email parameter is not found");
      return;
    }

    const adapter: SubscriptionCreateAdapter = await SubscriptionCreateAdapter.new({
      clientId: clientidParams[1],
      email: emailParams[1],
      token: authorizations[1],
    });

    const subscription: SubscriptionUseCaseDto =
      await this.subscriptionUseCase.createSubscription(adapter);

    await subscription.subscriber.connect();

    clientStates.set(socket, subscription.clientId);

    /**
     * Listen redis pub sub
     */
    await subscription.subscriber.subscribe(subscription.pubSubKey, async (message) => {
      const adapter: ChatOnDeliveredAdapter = await ChatOnDeliveredAdapter.new({
        chat: message,
        deliveredAt: new Date(),
      });

      this.chatUseCase.onChatDelivered(adapter);

      socket.send(message);
    });
  }

  async handleDisconnect(socket: WebSocket) {
    const clientId = clientStates.get(socket);

    const adapter: SubscriptionDeleteAdapter = await SubscriptionDeleteAdapter.new({
      clientId,
    });

    this.subscriptionUseCase.deleteSubscription(adapter);
  }

  @SubscribeMessage("onAck")
  async onAck(socket: WebSocket, data: any) {
    const adapter: ChatOnAckedAdapter = await ChatOnAckedAdapter.new({
      channelId: data.channelId,
      chatCreatedAt: new Date(data.createdAt),
      ackedAt: new Date(),
    });

    await this.chatUseCase.onChatAcked(adapter);
  }
}

import { Inject, Injectable, OnModuleInit } from "@nestjs/common";
import { ClientGrpc } from "@nestjs/microservices";
import { Observable } from "rxjs";

import { ChatServiceV1 as pb } from "@repo/grpc";
import { AppException, RemoteServerError, ResourceNotFound } from "@repo/nestjs-libs";
import { ChatroomInjectTokens } from "@core/domain/chatroom/chatroom.inject.tokens";

@Injectable()
export class ChatServiceClientManager implements OnModuleInit {
  private serviceClients: Map<symbol, pb.ChatServiceClient> = new Map();

  constructor(
    @Inject(ChatroomInjectTokens.CHAT_SEVICE_ASIA)
    private clientAsia: ClientGrpc,

    @Inject(ChatroomInjectTokens.CHAT_SEVICE_NA)
    private clientNa: ClientGrpc,

    // register different location clients ...
  ) {}

  onModuleInit() {
    const serviceClientToAsia = this.clientAsia.getService<pb.ChatServiceClient>(
      pb.CHAT_SERVICE_NAME,
    );

    const serviceClientToNa = this.clientNa.getService<pb.ChatServiceClient>(pb.CHAT_SERVICE_NAME);

    this.serviceClients.set(ChatroomInjectTokens.CHAT_SEVICE_ASIA, serviceClientToAsia);
    this.serviceClients.set(ChatroomInjectTokens.CHAT_SEVICE_NA, serviceClientToNa);
  }

  private dispatch(toNode: symbol): pb.ChatServiceClient {
    const serviceClient = this.serviceClients.get(toNode);
    if (!serviceClient) {
      throw AppException.new({
        code: ResourceNotFound,
        clientMessage: `specified client ${toNode.toString()} is not found`,
      });
    }
    return serviceClient;
  }

  publishChat(
    toNode: symbol,
    request: Observable<pb.PublishChatRequest>,
  ): Observable<pb.PublishChatResponse> {
    const serviceClient = this.dispatch(toNode);

    try {
      return serviceClient.publishChat(request);
    } catch (err: any) {
      throw AppException.new({ code: RemoteServerError, cause: err });
    }
  }

  subscribeBulk(toNode: symbol, request: pb.SubscribeBulkRequest) {
    const serviceClient = this.dispatch(toNode);

    try {
      return serviceClient.subscribeBulk(request);
    } catch (err: any) {
      throw AppException.new({ code: RemoteServerError, cause: err });
    }
  }
}

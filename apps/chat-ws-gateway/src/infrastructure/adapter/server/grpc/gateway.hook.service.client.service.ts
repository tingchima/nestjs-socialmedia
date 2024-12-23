import { Inject, Injectable, OnModuleInit } from "@nestjs/common";
import { ClientGrpc } from "@nestjs/microservices";

import { AppException, RemoteServerError } from "@repo/nestjs-libs";
import { GatewayHookServiceV1 as pb } from "@repo/grpc";

@Injectable()
export class GatewayHookServiceClientService implements pb.GatewayHookServiceClient, OnModuleInit {
  private serviceClient: pb.GatewayHookServiceClient;

  constructor(
    @Inject(pb.GATEWAY_HOOK_SERVICE_NAME)
    private client: ClientGrpc,
  ) {}

  onModuleInit(): void {
    this.serviceClient = this.client.getService<pb.GatewayHookServiceClient>(
      pb.GATEWAY_HOOK_SERVICE_NAME,
    );
  }

  onClientConnected(request: pb.OnClientConnectedRequest) {
    try {
      return this.serviceClient.onClientConnected(request);
    } catch (err: any) {
      throw AppException.new({ code: RemoteServerError, cause: err });
    }
  }

  onClientDisconnected(request: pb.OnClientDisconnectedRequest) {
    try {
      return this.serviceClient.onClientDisconnected(request);
    } catch (err: any) {
      throw AppException.new({ code: RemoteServerError, cause: err });
    }
  }

  onChatPublish(request: pb.OnChatPublishRequest) {
    try {
      return this.serviceClient.onChatPublish(request);
    } catch (err: any) {
      throw AppException.new({ code: RemoteServerError, cause: err });
    }
  }

  onChatDelivered(request: pb.OnChatDeliveredRequest) {
    try {
      return this.serviceClient.onChatDelivered(request);
    } catch (err: any) {
      throw AppException.new({ code: RemoteServerError, cause: err });
    }
  }

  onChatAcked(request: pb.OnChatAckedRequest) {
    try {
      return this.serviceClient.onChatAcked(request);
    } catch (err: any) {
      throw AppException.new({ code: RemoteServerError, cause: err });
    }
  }
}

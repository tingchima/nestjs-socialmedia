import { Module } from "@nestjs/common";
import {
  ClientsModule,
  ClientsProviderAsyncOptions,
  GrpcOptions,
  Transport,
} from "@nestjs/microservices";

import { ConfigModule, ConfigServicePort } from "@repo/nestjs-libs";
import { ChatServiceV1 as pb } from "@repo/grpc";
import { pbModulePath } from "@infrastructure/adapter/server/grpc/proto.path";
import { ChatroomInjectTokens } from "@core/domain/chatroom/chatroom.inject.tokens";

/**
 * Chat service
 */

const mulpitleChatServiceOptions = (): ClientsProviderAsyncOptions[] => {
  return [
    {
      imports: [ConfigModule],
      name: ChatroomInjectTokens.CHAT_SEVICE_ASIA,
      useFactory: (configService: ConfigServicePort): GrpcOptions => {
        return {
          transport: Transport.GRPC,
          options: {
            url: configService.GRPC_SERVER.CHAT_WS_GATEWAY_URL_ASIA,
            package: [pb.CHAT_WS_GATEWAY_V1_PACKAGE_NAME],
            protoPath: [`${pbModulePath}/chat_ws_gateway/v1/chat_service.proto`],
          },
        };
      },
      inject: [ConfigServicePort],
    },
    {
      imports: [ConfigModule],
      name: ChatroomInjectTokens.CHAT_SEVICE_NA,
      useFactory: async (configService: ConfigServicePort) => ({
        transport: Transport.GRPC,
        options: {
          url: configService.GRPC_SERVER.CHAT_WS_GATEWAY_URL_NA,
          package: [pb.CHAT_WS_GATEWAY_V1_PACKAGE_NAME],
          protoPath: [`${pbModulePath}/chat_ws_gateway/v1/chat_service.proto`],
        },
      }),
      inject: [ConfigServicePort],
    },
  ];
};

@Module({
  imports: [
    ClientsModule.registerAsync({
      isGlobal: true,
      clients: [...mulpitleChatServiceOptions()],
    }),
  ],
})
export class GrpcClientsModule {}

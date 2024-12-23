import { Module } from "@nestjs/common";
import { GrpcOptions, Transport } from "@nestjs/microservices";
import path from "path";

import { ConfigModule, ConfigServicePort } from "@repo/nestjs-libs";
import { ServerInjectToknes } from "@infrastructure/adapter/server/server.inject.tokens";

import { ChatServiceV1 as pb } from "@repo/grpc";

const pbModulePath = path.join(process.cwd(), "node_modules/@repo/grpc/protos");

@Module({
  imports: [ConfigModule],
  providers: [
    {
      provide: ServerInjectToknes.CHAT_SERVICE_OPTION,
      useFactory: (configService: ConfigServicePort): GrpcOptions => {
        return {
          transport: Transport.GRPC,
          options: {
            url: `localhost:${configService.GRPC_PORT}`,
            package: [pb.CHAT_WS_GATEWAY_V1_PACKAGE_NAME],
            protoPath: [path.join(pbModulePath, "chat_ws_gateway/v1/chat_service.proto")],
          },
        };
      },
      inject: [ConfigServicePort],
    },
  ],
  exports: [ServerInjectToknes.CHAT_SERVICE_OPTION],
})
export class GrpcServerModule {}

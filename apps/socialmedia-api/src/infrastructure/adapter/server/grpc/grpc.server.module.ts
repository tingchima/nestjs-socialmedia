import { Module } from "@nestjs/common";
import { GrpcOptions, Transport } from "@nestjs/microservices";

import { ConfigModule, ConfigServicePort } from "@repo/nestjs-libs";
import { ServerInjectToknes } from "@infrastructure/adapter/server/server.inject.tokens";
import { GatewayHookServiceV1 as pb } from "@repo/grpc";
import { pbModulePath } from "@infrastructure/adapter/server/grpc/proto.path";

@Module({
  imports: [ConfigModule],
  providers: [
    {
      provide: ServerInjectToknes.GATEWAY_HOOK_SERVICE_OPTION,
      useFactory: (configService: ConfigServicePort): GrpcOptions => {
        return {
          transport: Transport.GRPC,
          options: {
            url: `localhost:${configService.GRPC_PORT}`,
            package: [pb.SOCIALMEDIA_API_V1_PACKAGE_NAME],
            protoPath: [`${pbModulePath}/socialmedia_api/v1/gateway_hook_service.proto`],
          },
        };
      },
      inject: [ConfigServicePort],
    },
  ],
  exports: [ServerInjectToknes.GATEWAY_HOOK_SERVICE_OPTION],
})
export class GrpcServerModule {}

import path from "path";
import { Module } from "@nestjs/common";
import { ClientsModule, ClientsProviderAsyncOptions, Transport } from "@nestjs/microservices";

import { ConfigModule, ConfigServicePort } from "@repo/nestjs-libs";
import { GatewayHookServiceV1 as pb } from "@repo/grpc";

const pbModulePath = path.join(process.cwd(), "node_modules/@repo/grpc/protos");

/**
 * Gateway hook service
 */
const chatServiceClientService: ClientsProviderAsyncOptions = {
  imports: [ConfigModule],
  name: pb.GATEWAY_HOOK_SERVICE_NAME,
  useFactory: (configService: ConfigServicePort) => {
    return {
      transport: Transport.GRPC,
      options: {
        url: configService.GRPC_SERVER.SOCIALMEDIA_API_URL,
        package: [pb.SOCIALMEDIA_API_V1_PACKAGE_NAME],
        protoPath: path.join(pbModulePath, "socialmedia_api/v1/gateway_hook_service.proto"),
      },
    };
  },
  inject: [ConfigServicePort],
};

@Module({
  imports: [
    ClientsModule.registerAsync({
      isGlobal: true,
      clients: [chatServiceClientService],
    }),
  ],
  providers: [],
})
export class GrpcClientsModule {}

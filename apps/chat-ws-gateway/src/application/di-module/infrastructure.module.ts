import { Global, Module, Provider } from "@nestjs/common";
import { CqrsModule } from "@nestjs/cqrs";

import {
  ConfigModule,
  ConfigServicePort,
  RedisModule,
  RedisModuleOptions,
} from "@repo/nestjs-libs";
import { GrpcClientsModule } from "@infrastructure/adapter/server/grpc/grpc.clients.module";
import { CqrsInjectTokens } from "@infrastructure/adapter/handler/cqrs.bus.inject.tokens";
import { CqrsEventBusAdapter } from "@infrastructure/adapter/handler/cqrs.event.bus.adapter";
import { GrpcServerModule } from "@infrastructure/adapter/server/grpc/grpc.server.module";

const busProviders: Provider[] = [
  {
    provide: CqrsInjectTokens.EVENT_BUS,
    useClass: CqrsEventBusAdapter,
  },
];

@Global()
@Module({
  imports: [
    CqrsModule.forRoot(),
    ConfigModule,
    GrpcClientsModule,
    GrpcServerModule,
    /**
     * Redis as cache
     */
    RedisModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigServicePort): RedisModuleOptions => {
        return {
          HOST: configService.CACHE.HOST,
          PORT: configService.CACHE.PORT,
          DATABASE: configService.CACHE.DATABASE,
          USERNAME: configService.CACHE.USERNAME,
          PASSWORD: configService.CACHE.PASSWORD,
        };
      },
      inject: [ConfigServicePort],
    }),
  ],
  providers: [...busProviders],
  exports: [CqrsInjectTokens.EVENT_BUS],
})
export class InfrastructureModule {}

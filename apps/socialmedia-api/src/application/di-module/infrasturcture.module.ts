import { Module } from "@nestjs/common";

import {
  ConfigModule,
  ConfigServicePort,
  KnexModule,
  KnexModuleOptions,
  AwsDynamoDBModule,
  AwsS3Module,
  AwsS3ModuleOptions,
  AwsDynamoDBModuleOptions,
  RedisModule,
  RedisModuleOptions,
  LoggerModule,
  ElasticsearchModule,
  ElasticsearchModuleOptions,
} from "@repo/nestjs-libs";
import { GrpcServerModule } from "@infrastructure/adapter/server/grpc/grpc.server.module";
import { GrpcClientsModule } from "@infrastructure/adapter/server/grpc/grpc.clients.module";

@Module({
  imports: [
    LoggerModule,
    /**
     * Knex as persistence
     */
    KnexModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigServicePort): KnexModuleOptions => {
        return {
          CLIENT: configService.DATABASE.CLIENT,
          HOST: configService.DATABASE.HOST,
          PORT: configService.DATABASE.PORT,
          NAME: configService.DATABASE.NAME,
          USER: configService.DATABASE.USER,
          PASSWORD: configService.DATABASE.PASSWORD,
        };
      },
      inject: [ConfigServicePort],
    }),
    /**
     * Aws DynamoDB as persistence
     */
    AwsDynamoDBModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigServicePort): AwsDynamoDBModuleOptions => {
        return {
          REGION: configService.AWS.REGION,
          ENDPOINT: configService.AWS.ENDPOINT,
        };
      },
      inject: [ConfigServicePort],
    }),
    /**
     * Aws s3 as persistence
     */
    AwsS3Module.registerAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigServicePort): AwsS3ModuleOptions => {
        return {
          REGION: configService.AWS.REGION,
          ENDPOINT: configService.AWS.ENDPOINT,
        };
      },
      inject: [ConfigServicePort],
    }),
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
    /**
     * Elasticsearch as search engine
     */
    ElasticsearchModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigServicePort): ElasticsearchModuleOptions => {
        return {
          NODES: [configService.ELASTICSEARCH.NODES],
        };
      },
      inject: [ConfigServicePort],
    }),
    /**
     * Grpc server
     */
    GrpcServerModule,
    /**
     * Grpc clients
     */
    GrpcClientsModule,
  ],
})
export class InfrastructureModule {}

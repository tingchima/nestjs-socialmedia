import { Module } from "@nestjs/common";

import {
  ConfigModule,
  ConfigServicePort,
  ElasticsearchModule,
  ElasticsearchModuleOptions,
} from "@repo/nestjs-libs";

@Module({
  imports: [
    ConfigModule,
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
  ],
  providers: [],
  exports: [],
})
export class InfrastructureModule {}

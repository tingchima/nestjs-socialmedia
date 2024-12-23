import { DynamicModule, Global, Module } from "@nestjs/common";

import { ElasticsearchService } from "./elasticsearch.service";
import { ElasticsearchInjectTokens } from "./elasticsearch.inject.tokens";
import {
  ElasticsearchModuleAsyncOptions,
  ElasticsearchModuleOptions,
  ElasticsearchOptionsFactory,
} from "./interfaces/elasticsearch.module.options";

export const elasticsearchConnectionFactory = {
  provide: ElasticsearchInjectTokens.ELASRICSEARCH_CLIENT,
  useFactory: async (service: ElasticsearchService) => {
    return service.getClient();
  },
  inject: [ElasticsearchService],
};

@Global()
@Module({
  providers: [ElasticsearchService, elasticsearchConnectionFactory],
  exports: [ElasticsearchService, elasticsearchConnectionFactory],
})
export class ElasticsearchModule {
  static register(options: ElasticsearchModuleOptions): DynamicModule {
    return {
      module: ElasticsearchModule,
      providers: [
        {
          provide: ElasticsearchInjectTokens.ELASRICSEARCH_MODULE_OPTIONS,
          useValue: options || {},
        },
      ],
    };
  }

  static registerAsync(options: ElasticsearchModuleAsyncOptions): DynamicModule {
    return {
      module: ElasticsearchModule,
      imports: options.imports || [],
      providers: [...createAsyncProviders(options)],
    };
  }
}

function createAsyncProviders(options: ElasticsearchModuleAsyncOptions): any[] {
  if (options.useExisting || options.useFactory) {
    return [createAsyncProvider(options)];
  }
  return [
    {
      provide: options.useClass,
      useClass: options.useClass,
    },
    createAsyncProvider(options),
  ];
}

function createAsyncProvider(options: ElasticsearchModuleAsyncOptions): any {
  if (options.useFactory) {
    return {
      provide: ElasticsearchInjectTokens.ELASRICSEARCH_MODULE_OPTIONS,
      useFactory: options.useFactory,
      inject: options.inject || [],
    };
  }

  return {
    provide: ElasticsearchInjectTokens.ELASRICSEARCH_MODULE_OPTIONS,
    useFactory: async (optionsFactory: ElasticsearchOptionsFactory) =>
      await optionsFactory.createElasticsearchOptions(),
    inject: [options.useExisting || options.useClass],
  };
}

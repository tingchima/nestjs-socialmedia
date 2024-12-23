import { DynamicModule, Global, Module } from "@nestjs/common";

import { ConfigModule } from "../../../config";
import { RedisInjectTokens } from "./redis.inject.tokens";
import { RedisModuleAsyncOptions, RedisOptionsFactory } from "./interfaces/redis.module.options";
import { RedisService } from "./redis.service";

export const redisConnectionFactory = {
  provide: RedisInjectTokens.REDIS_CLIENT,
  useFactory: async (service: RedisService) => {
    return await service.getClient();
  },
  inject: [RedisService],
};

@Global()
@Module({
  imports: [ConfigModule],
  providers: [RedisService, redisConnectionFactory],
  exports: [RedisService, redisConnectionFactory],
})
export class RedisModule {
  static registerAsync(options: RedisModuleAsyncOptions): DynamicModule {
    return {
      module: RedisModule,
      imports: options.imports || [],
      providers: [...createAsyncProviders(options)],
    };
  }
}

function createAsyncProviders(options: RedisModuleAsyncOptions): any[] {
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

function createAsyncProvider(options: RedisModuleAsyncOptions): any {
  if (options.useFactory) {
    return {
      provide: RedisInjectTokens.REDIS_MODULE_OPTIONS,
      useFactory: options.useFactory,
      inject: options.inject || [],
    };
  }

  return {
    provide: RedisInjectTokens.REDIS_MODULE_OPTIONS,
    useFactory: async (optionsFactory: RedisOptionsFactory) =>
      await optionsFactory.createRedisOptions(),
    inject: [options.useExisting || options.useClass],
  };
}

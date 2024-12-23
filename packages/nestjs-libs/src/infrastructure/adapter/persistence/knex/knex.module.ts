import { DynamicModule, Global, Module } from "@nestjs/common";
import {
  KnexModuleAsyncOptions,
  KnexModuleOptions,
  KnexOptionsFactory,
} from "./interfaces/knex.module.options";
import { KnexService } from "./knex.service";
import { KnexInjectTokens } from "./knex.inject.tokens";

export const knexConnectionFactory = {
  provide: KnexInjectTokens.KNEX_CONNECTION,
  useFactory: async (knexService: KnexService) => {
    return knexService.getKnex();
  },
  inject: [KnexService],
};

@Global()
@Module({
  providers: [KnexService, knexConnectionFactory],
  exports: [KnexService, knexConnectionFactory],
})
export class KnexModule {
  static register(options: KnexModuleOptions): DynamicModule {
    return {
      module: KnexModule,
      providers: [
        {
          provide: KnexInjectTokens.KNEX_MODULE_OPTIONS,
          useValue: options || {},
        },
      ],
    };
  }

  static registerAsync(options: KnexModuleAsyncOptions): DynamicModule {
    return {
      module: KnexModule,
      imports: options.imports || [],
      providers: [...createAsyncProviders(options)],
    };
  }
}

function createAsyncProviders(options: KnexModuleAsyncOptions): any[] {
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

function createAsyncProvider(options: KnexModuleAsyncOptions): any {
  if (options.useFactory) {
    return {
      provide: KnexInjectTokens.KNEX_MODULE_OPTIONS,
      useFactory: options.useFactory,
      inject: options.inject || [],
    };
  }

  return {
    provide: KnexInjectTokens.KNEX_MODULE_OPTIONS,
    useFactory: async (optionsFactory: KnexOptionsFactory) =>
      await optionsFactory.createKnexOptions(),
    inject: [options.useExisting || options.useClass],
  };
}

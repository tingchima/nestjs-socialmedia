import { DynamicModule, Global, Module } from "@nestjs/common";

import { AwsDynamoDBService } from "./aws.dynamodb.service";
import { AwsDynamoDBInjectTokens } from "./aws.dynamodb.inject.tokens";
import {
  AwsDynamoDBModuleAsyncOptions,
  AwsDynamoDBModuleOptions,
  AwsDynamoDBOptionsFactory,
} from "./interfaces/aws.dynamodb.module.options";

export const awsDynamoDBConnectionFactory = {
  provide: AwsDynamoDBInjectTokens.AWS_DYNAMO_DB_CLIENT,
  useFactory: async (service: AwsDynamoDBService) => {
    return service.getClient();
  },
  inject: [AwsDynamoDBService],
};

@Global()
@Module({
  providers: [AwsDynamoDBService, awsDynamoDBConnectionFactory],
  exports: [AwsDynamoDBService, awsDynamoDBConnectionFactory],
})
export class AwsDynamoDBModule {
  static register(options: AwsDynamoDBModuleOptions): DynamicModule {
    return {
      module: AwsDynamoDBModule,
      providers: [
        {
          provide: AwsDynamoDBInjectTokens.AWS_DYNAMO_DB_MODULE_OPTIONS,
          useValue: options || {},
        },
      ],
    };
  }

  static registerAsync(options: AwsDynamoDBModuleAsyncOptions): DynamicModule {
    return {
      module: AwsDynamoDBModule,
      imports: options.imports || [],
      providers: [...createAsyncProviders(options)],
    };
  }
}

function createAsyncProviders(options: AwsDynamoDBModuleAsyncOptions): any[] {
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

function createAsyncProvider(options: AwsDynamoDBModuleAsyncOptions): any {
  if (options.useFactory) {
    return {
      provide: AwsDynamoDBInjectTokens.AWS_DYNAMO_DB_MODULE_OPTIONS,
      useFactory: options.useFactory,
      inject: options.inject || [],
    };
  }

  return {
    provide: AwsDynamoDBInjectTokens.AWS_DYNAMO_DB_MODULE_OPTIONS,
    useFactory: async (optionsFactory: AwsDynamoDBOptionsFactory) =>
      await optionsFactory.createAwsDynamoDBOptions(),
    inject: [options.useExisting || options.useClass],
  };
}

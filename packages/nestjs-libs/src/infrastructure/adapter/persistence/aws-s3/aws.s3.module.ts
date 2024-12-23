import { DynamicModule, Global, Module } from "@nestjs/common";

import { AwsS3Service } from "./aws.s3.service";
import { AwsS3InjectTokens } from "./aws.s3.inject.tokens";
import {
  AwsS3ModuleAsyncOptions,
  AwsS3ModuleOptions,
  AwsS3OptionsFactory,
} from "./interfaces/aws.s3.module.options";

export const awsS3ConnectionFactory = {
  provide: AwsS3InjectTokens.AWS_S3_CLIENT,
  useFactory: async (service: AwsS3Service) => {
    return service.getClient();
  },
  inject: [AwsS3Service],
};

@Global()
@Module({
  providers: [AwsS3Service, awsS3ConnectionFactory],
  exports: [AwsS3Service, awsS3ConnectionFactory],
})
export class AwsS3Module {
  static register(options: AwsS3ModuleOptions): DynamicModule {
    return {
      module: AwsS3Module,
      providers: [
        {
          provide: AwsS3InjectTokens.AWS_S3_MODULE_OPTIONS,
          useValue: options || {},
        },
      ],
    };
  }

  static registerAsync(options: AwsS3ModuleAsyncOptions): DynamicModule {
    return {
      module: AwsS3Module,
      imports: options.imports || [],
      providers: [...createAsyncProviders(options)],
    };
  }
}

function createAsyncProviders(options: AwsS3ModuleAsyncOptions): any[] {
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

function createAsyncProvider(options: AwsS3ModuleAsyncOptions): any {
  if (options.useFactory) {
    return {
      provide: AwsS3InjectTokens.AWS_S3_MODULE_OPTIONS,
      useFactory: options.useFactory,
      inject: options.inject || [],
    };
  }

  return {
    provide: AwsS3InjectTokens.AWS_S3_MODULE_OPTIONS,
    useFactory: async (optionsFactory: AwsS3OptionsFactory) =>
      await optionsFactory.createAwsS3Options(),
    inject: [options.useExisting || options.useClass],
  };
}

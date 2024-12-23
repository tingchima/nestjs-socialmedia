import { ModuleMetadata, Type } from "@nestjs/common";

export interface AwsDynamoDBModuleOptions {
  ENDPOINT: string;

  REGION: string;
}

export interface AwsDynamoDBOptionsFactory {
  createAwsDynamoDBOptions():
    | Promise<AwsDynamoDBModuleOptions>
    | AwsDynamoDBModuleOptions;
}

export interface AwsDynamoDBModuleAsyncOptions
  extends Pick<ModuleMetadata, "imports"> {
  inject?: any[];
  useClass?: Type<AwsDynamoDBOptionsFactory>;
  useExisting?: Type<AwsDynamoDBOptionsFactory>;
  useFactory?: (
    ...args: any[]
  ) => Promise<AwsDynamoDBModuleOptions> | AwsDynamoDBModuleOptions;
}

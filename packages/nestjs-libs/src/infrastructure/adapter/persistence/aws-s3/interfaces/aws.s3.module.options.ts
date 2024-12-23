import { ModuleMetadata, Type } from "@nestjs/common";

export interface AwsS3ModuleOptions {
  ENDPOINT: string;

  REGION: string;
}

export interface AwsS3OptionsFactory {
  createAwsS3Options(): Promise<AwsS3ModuleOptions> | AwsS3ModuleOptions;
}

export interface AwsS3ModuleAsyncOptions
  extends Pick<ModuleMetadata, "imports"> {
  inject?: any[];
  useClass?: Type<AwsS3OptionsFactory>;
  useExisting?: Type<AwsS3OptionsFactory>;
  useFactory?: (
    ...args: any[]
  ) => Promise<AwsS3ModuleOptions> | AwsS3ModuleOptions;
}

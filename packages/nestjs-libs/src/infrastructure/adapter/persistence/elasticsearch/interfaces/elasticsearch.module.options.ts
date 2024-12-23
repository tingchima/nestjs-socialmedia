import { ModuleMetadata, Type } from "@nestjs/common";

export interface ElasticsearchModuleOptions {
  NODE?: string | string[];
  NODES?: string[] | string;
}

export interface ElasticsearchOptionsFactory {
  createElasticsearchOptions(): Promise<ElasticsearchModuleOptions> | ElasticsearchModuleOptions;
}

export interface ElasticsearchModuleAsyncOptions extends Pick<ModuleMetadata, "imports"> {
  inject?: any[];
  useClass?: Type<ElasticsearchOptionsFactory>;
  useExisting?: Type<ElasticsearchOptionsFactory>;
  useFactory?: (...args: any[]) => Promise<ElasticsearchModuleOptions> | ElasticsearchModuleOptions;
}

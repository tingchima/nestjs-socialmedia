import { ModuleMetadata, Type } from "@nestjs/common";

export interface RedisModuleOptions {
  HOST: string;
  PORT: number;
  USERNAME: string;
  PASSWORD: string;
  DATABASE: number;
}

export interface RedisOptionsFactory {
  createRedisOptions(): Promise<RedisModuleOptions> | RedisModuleOptions;
}

export interface RedisModuleAsyncOptions extends Pick<ModuleMetadata, "imports"> {
  inject?: any[];
  useClass?: Type<RedisOptionsFactory>;
  useExisting?: Type<RedisOptionsFactory>;
  useFactory?: (...args: any[]) => Promise<RedisModuleOptions> | RedisModuleOptions;
}

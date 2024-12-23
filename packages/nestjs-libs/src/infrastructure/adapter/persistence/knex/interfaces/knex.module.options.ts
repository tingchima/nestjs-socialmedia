import { ModuleMetadata, Type } from "@nestjs/common";

export interface KnexModuleOptions {
  /**
   * database driver
   */
  CLIENT: string;
  /**
   * server name or IP address
   */
  HOST: string;
  /**
   * server port number
   */
  PORT: number;
  /**
   * database name
   */
  NAME: string;
  /**
   * user name
   */
  USER: string;
  /**
   * user password
   */
  PASSWORD: string;
}

export interface KnexOptionsFactory {
  createKnexOptions(): Promise<KnexModuleOptions> | KnexModuleOptions;
}

export interface KnexModuleAsyncOptions
  extends Pick<ModuleMetadata, "imports"> {
  inject?: any[];
  useClass?: Type<KnexOptionsFactory>;
  useExisting?: Type<KnexOptionsFactory>;
  useFactory?: (
    ...args: any[]
  ) => Promise<KnexModuleOptions> | KnexModuleOptions;
}

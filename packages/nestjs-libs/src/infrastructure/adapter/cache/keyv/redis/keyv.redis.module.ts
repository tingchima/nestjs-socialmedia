import { Global, Module } from "@nestjs/common";

import { KeyvInjectTokens } from "../keyv.inject.tokens";
import KeyvRedis, { Keyv } from "@keyv/redis";
import { ConfigModule, ConfigServicePort } from "../../../../config";

@Global()
@Module({
  imports: [ConfigModule],
  providers: [
    {
      provide: KeyvInjectTokens.KEYV_REDIS_CONNECTION,
      useFactory: (configService: ConfigServicePort): Keyv => {
        const keyv = new Keyv({
          store: new KeyvRedis({
            url: `redis://${configService.CACHE.HOST}:${configService.CACHE.PORT}`,
            username: configService.CACHE.USERNAME,
            password: configService.CACHE.PASSWORD,
            database: configService.CACHE.DATABASE,
          }),
        });
        return keyv;
      },
      inject: [ConfigServicePort],
    },
  ],
  exports: [KeyvInjectTokens.KEYV_REDIS_CONNECTION],
})
export class KeyvRedisModule {}

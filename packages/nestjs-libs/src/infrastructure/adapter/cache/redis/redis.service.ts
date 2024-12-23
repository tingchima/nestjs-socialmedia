import { Inject, Injectable } from "@nestjs/common";
import { createClient, RedisClientType } from "redis";
import { RedisInjectTokens } from "./redis.inject.tokens";
import { RedisModuleOptions } from "./interfaces/redis.module.options";
interface RedisServicePort {
  getClient(): Promise<RedisClientType>;
}

@Injectable()
export class RedisService implements RedisServicePort {
  private _client: RedisClientType;

  constructor(
    @Inject(RedisInjectTokens.REDIS_MODULE_OPTIONS)
    private readonly options: RedisModuleOptions,
  ) {}

  async getClient(): Promise<RedisClientType> {
    if (!this._client) {
      this._client = createClient({
        url: `redis://${this.options.HOST}:${this.options.PORT}`,
        database: this.options.DATABASE,
        username: this.options.USERNAME,
        password: this.options.PASSWORD,
      });

      await this._client.connect();
    }

    return this._client;
  }
}

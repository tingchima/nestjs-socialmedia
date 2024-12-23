export class RedisInjectTokens {
  public static readonly REDIS_CLIENT: unique symbol = Symbol.for("REDIS_CLIENT");

  public static readonly REDIS_MODULE_OPTIONS: unique symbol = Symbol.for("REDIS_MODULE_OPTIONS");
}

export class KnexInjectTokens {
  public static readonly KNEX_CONNECTION: unique symbol = Symbol.for("KNEX_CONNECTION");

  public static readonly KNEX_MODULE_OPTIONS: unique symbol = Symbol("KNEX_MODULE_OPTIONS");
}

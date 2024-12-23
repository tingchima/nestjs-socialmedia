export class UserInjectTokens {
  public static readonly USER_USE_CASE: unique symbol = Symbol.for("USER_USE_CASE");

  public static readonly USER_REPOSITORY: unique symbol = Symbol.for("USER_REPOSITORY");

  public static readonly USER_MAPPER: unique symbol = Symbol.for("USER_MAPPER");
}

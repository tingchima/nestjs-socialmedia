export class ChatroomInjectTokens {
  /**
   * Channel
   */

  public static readonly CHANNEL_USE_CASE: unique symbol = Symbol.for("CHANNEL_USE_CASE");

  public static readonly CHANNEL_REPOSITORY: unique symbol = Symbol.for("CHANNEL_REPOSITORY");

  public static readonly CHANNEL_MAPPER: unique symbol = Symbol.for("CHANNEL_MAPPER");

  /**
   * Member
   */

  public static readonly MEMBER_USE_CASE: unique symbol = Symbol.for("MEMBER_USE_CASE");

  public static readonly MEMBER_REPOSITORY: unique symbol = Symbol.for("MEMBER_REPOSITORY");

  public static readonly MEMBER_MAPPER: unique symbol = Symbol.for("MEMBER_MAPPER");

  /**
   * Chat
   */

  public static readonly CHAT_USE_CASE: unique symbol = Symbol.for("CHAT_USE_CASE");

  public static readonly CHAT_REPOSITORY: unique symbol = Symbol.for("CHAT_REPOSITORY");

  public static readonly CHAT_SEARCH_REPOSITORY: unique symbol =
    Symbol.for("CHAT_SEARCH_REPOSITORY");

  public static readonly CHAT_MAPPER: unique symbol = Symbol.for("CHAT_MAPPER");

  public static readonly CHAT_SEVICE_NA: unique symbol = Symbol.for("CHAT_SEVICE_NA");

  public static readonly CHAT_SEVICE_ASIA: unique symbol = Symbol.for("CHAT_SEVICE_ASIA");

  public static readonly CHAT_SEVICE_CLIENT_MANAGER: unique symbol = Symbol.for(
    "CHAT_SEVICE_CLIENT_MANAGER",
  );

  /**
   * Subscription
   */

  public static readonly SUBSCRIPTION_REPOSITORY: unique symbol =
    Symbol.for("SUBSCRIPTION_REPOSITORY");

  /**
   * Ws client
   */

  public static readonly WS_CLIENT_REPOSITORY: unique symbol = Symbol.for("WS_CLIENT_REPOSITORY");
}

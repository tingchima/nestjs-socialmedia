export class ChatroomInjectTokens {
  /**
   * Chat
   */

  public static readonly CHAT_SEARCH_REPOSITORY: unique symbol =
    Symbol.for("CHAT_SEARCH_REPOSITORY");

  public static readonly CHAT_MAPPER: unique symbol = Symbol.for("CHAT_MAPPER");

  public static readonly CHAT_USE_CASE: unique symbol = Symbol.for("CHAT_USE_CASE");
}

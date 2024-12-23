export class ChatroomInjectTokens {
  public static readonly ON_CLIENT_CONNECTED_EVENT_HANDLER: unique symbol = Symbol.for(
    "ON_CLIENT_CONNECTED_EVENT_HANDLER",
  );

  public static readonly ON_CLIENT_DISCONNECTED_EVENT_HANDLER: unique symbol = Symbol.for(
    "ON_CLIENT_DISCONNECTED_EVENT_HANDLER",
  );

  public static readonly ON_CHAT_ACKED_EVENT_HANDLER: unique symbol = Symbol.for(
    "ON_CHAT_ACKED_EVENT_HANDLER",
  );

  public static readonly ON_CHAT_DELIVERED_EVENT_HANDLER: unique symbol = Symbol.for(
    "ON_CHAT_DELIVERED_EVENT_HANDLER",
  );

  public static readonly ON_CHAT_PUBLISH_EVENT_HANDLER: unique symbol = Symbol.for(
    "ON_CHAT_PUBLISH_EVENT_HANDLER",
  );

  public static readonly GATEWAY_HOOK_SERVICE_CLIENT_SERVICE: unique symbol = Symbol.for(
    "GATEWAY_HOOK_SERVICE_CLIENT_SERVICE",
  );

  public static readonly CHAT_USE_CASE: unique symbol = Symbol.for("CHAT_USE_CASE");

  public static readonly SUBSCRIPTION_USE_CASE: unique symbol = Symbol.for("SUBSCRIPTION_USE_CASE");

  public static readonly SUBSCRIPTION_REPOSITORY: unique symbol =
    Symbol.for("SUBSCRIPTION_REPOSITORY");
}

export class MediaInjectTokens {
  public static readonly MEDIA_FILE_STORAGE: unique symbol = Symbol.for("MEDIA_FILE_STORAGE");

  public static readonly SIGNED_URL_USE_CASE: unique symbol = Symbol("SIGNED_URL_USE_CASE");

  public static readonly MEDIA_USE_CASE: unique symbol = Symbol.for("MEDIA_USE_CASE");

  public static readonly MEDIA_REPOSITORY: unique symbol = Symbol.for("MEDIA_REPOSITORY");
}

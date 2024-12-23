export class ElasticsearchInjectTokens {
  public static readonly ELASRICSEARCH_CLIENT: unique symbol = Symbol.for("ELASRICSEARCH_CLIENT");

  public static readonly ELASRICSEARCH_MODULE_OPTIONS: unique symbol = Symbol.for(
    "ELASRICSEARCH_MODULE_OPTIONS",
  );
}

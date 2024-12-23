export class AwsDynamoDBInjectTokens {
  public static readonly AWS_DYNAMO_DB_CLIENT: unique symbol = Symbol(
    "AWS_DYNAMO_DB_CLIENT",
  );

  public static readonly AWS_DYNAMO_DB_MODULE_OPTIONS: unique symbol = Symbol(
    "AWS_DYNAMO_DB_MODULE_OPTIONS",
  );
}

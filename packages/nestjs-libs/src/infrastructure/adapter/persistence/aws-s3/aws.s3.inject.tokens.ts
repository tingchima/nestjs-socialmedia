export class AwsS3InjectTokens {
  public static readonly AWS_S3_CLIENT: unique symbol = Symbol.for("AWS_S3_CLIENT");

  public static readonly AWS_S3_MODULE_OPTIONS: unique symbol = Symbol("AWS_S3_MODULE_OPTIONS");
}

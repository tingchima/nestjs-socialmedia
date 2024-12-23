import { Inject, Injectable } from "@nestjs/common";
import { S3Client } from "@aws-sdk/client-s3";

import { AwsS3InjectTokens } from "./aws.s3.inject.tokens";
import { AwsS3ModuleOptions } from "./interfaces/aws.s3.module.options";

interface AwsS3ServicePort {
  getClient(): S3Client;
}

@Injectable()
export class AwsS3Service implements AwsS3ServicePort {
  private _client: S3Client;

  constructor(
    @Inject(AwsS3InjectTokens.AWS_S3_MODULE_OPTIONS)
    private readonly options: AwsS3ModuleOptions,
  ) {}

  getClient() {
    if (!this._client) {
      this._client = new S3Client({
        endpoint: this.options.ENDPOINT,
        region: this.options.REGION,
      });
    }
    return this._client;
  }
}

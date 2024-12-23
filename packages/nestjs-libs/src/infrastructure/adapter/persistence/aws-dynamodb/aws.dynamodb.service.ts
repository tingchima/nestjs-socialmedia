import { Inject, Injectable } from "@nestjs/common";
import { AwsDynamoDBModuleOptions } from "./interfaces/aws.dynamodb.module.options";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { AwsDynamoDBInjectTokens } from "./aws.dynamodb.inject.tokens";

interface AwsDynamoDBServicePort {
  getClient(): DynamoDBClient;
}

@Injectable()
export class AwsDynamoDBService implements AwsDynamoDBServicePort {
  private _client: DynamoDBClient;

  constructor(
    @Inject(AwsDynamoDBInjectTokens.AWS_DYNAMO_DB_MODULE_OPTIONS)
    private readonly options: AwsDynamoDBModuleOptions,
  ) {}

  getClient() {
    if (!this._client) {
      this._client = new DynamoDBClient({
        endpoint: this.options.ENDPOINT,
        region: this.options.REGION,
      });
    }
    return this._client;
  }
}

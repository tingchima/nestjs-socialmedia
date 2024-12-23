import { Entity, Mapper } from "@repo/nestjs-libs";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";

export abstract class AwsDynamoDBRepository<E extends Entity<any>, M> {
  protected abstract tableName: string;

  constructor(
    readonly client: DynamoDBClient,
    readonly mapper: Mapper<E, M>,
  ) {}
}

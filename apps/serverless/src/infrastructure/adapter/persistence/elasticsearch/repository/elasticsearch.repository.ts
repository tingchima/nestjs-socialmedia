import { Entity, Mapper } from "@repo/nestjs-libs";
import { Client } from "@elastic/elasticsearch";

export abstract class ElasticsearchRepository<E extends Entity<any>, M> {
  protected abstract indexName: string;

  constructor(
    readonly client: Client,
    readonly mapper: Mapper<E, M>,
  ) {}
}

import { Inject, Injectable } from "@nestjs/common";
import { Client } from "@elastic/elasticsearch";

import { ElasticsearchInjectTokens } from "./elasticsearch.inject.tokens";
import { ElasticsearchModuleOptions } from "./interfaces/elasticsearch.module.options";

interface ElasticsearchServicePort {
  getClient(): any;
}

@Injectable()
export class ElasticsearchService implements ElasticsearchServicePort {
  private _client: any;

  constructor(
    @Inject(ElasticsearchInjectTokens.ELASRICSEARCH_MODULE_OPTIONS)
    private readonly options: ElasticsearchModuleOptions,
  ) {}

  getClient() {
    return this._client
      ? this._client
      : (this._client = new Client({
          nodes: this.options.NODES,
          node: this.options.NODE,
        }));
  }
}

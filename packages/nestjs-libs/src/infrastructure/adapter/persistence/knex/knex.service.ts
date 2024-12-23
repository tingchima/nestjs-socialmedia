import { Inject, Injectable } from "@nestjs/common";
import { KnexModuleOptions } from "./interfaces/knex.module.options";
import { KnexInjectTokens } from "./knex.inject.tokens";

// eslint-disable-next-line @typescript-eslint/no-require-imports
const Knex = require("knex");

interface KnexServicePort {
  getKnex(): any;
}

@Injectable()
export class KnexService implements KnexServicePort {
  private _dbConn: any;

  constructor(
    @Inject(KnexInjectTokens.KNEX_MODULE_OPTIONS)
    private readonly options: KnexModuleOptions,
  ) {}

  getKnex() {
    return this._dbConn
      ? this._dbConn
      : (this._dbConn = new Knex({
          client: this.options.CLIENT,
          connection: {
            host: this.options.HOST,
            port: this.options.PORT,
            user: this.options.USER,
            password: this.options.PASSWORD,
            database: this.options.NAME,
          },
          pool: {
            min: 10,
            max: 50,
          },
        }));
  }
}

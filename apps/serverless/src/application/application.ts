import { INestApplicationContext } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";

import { RootModule } from "@application/di-module/root.module";

export class Application {
  public async ctx(): Promise<INestApplicationContext> {
    return await NestFactory.createApplicationContext(RootModule);
  }

  public static new(): Application {
    return new Application();
  }
}

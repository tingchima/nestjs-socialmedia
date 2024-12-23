import { NestFactory } from "@nestjs/core";
import { MicroserviceOptions } from "@nestjs/microservices";

import { RootModule } from "@application/di-module/root.module";
import { ConfigServicePort } from "@repo/nestjs-libs";
import { ServerInjectToknes } from "@infrastructure/adapter/server/server.inject.tokens";
import { WsAdapter } from "@nestjs/platform-ws";

export class Application {
  public async run(): Promise<void> {
    const app = await NestFactory.create(RootModule);

    const { PORT } = app.get(ConfigServicePort);

    app.useWebSocketAdapter(new WsAdapter(app));

    app.connectMicroservice<MicroserviceOptions>(app.get(ServerInjectToknes.CHAT_SERVICE_OPTION));

    app.enableShutdownHooks();
    await app.startAllMicroservices();
    await app.listen(PORT);
    console.log(`Application is running on: ${await app.getUrl()}`);
  }

  public static new(): Application {
    return new Application();
  }
}

import { NestFactory } from "@nestjs/core";
import { NestExpressApplication } from "@nestjs/platform-express";
import { MicroserviceOptions } from "@nestjs/microservices";

import { RootModule } from "@application/di-module/root.module";
import {
  AccessLogInterceptor,
  ConfigServicePort,
  ContextInterceptor,
  LoggerServicePort,
} from "@repo/nestjs-libs";
import { ServerInjectToknes } from "@infrastructure/adapter/server/server.inject.tokens";
import { HttpExceptionFilter } from "@application/api-route/http/http.exception.filter";

export class Application {
  public async run(): Promise<void> {
    const app: NestExpressApplication =
      await NestFactory.create<NestExpressApplication>(RootModule);

    app.setGlobalPrefix("api");

    const { APP_NAME, PORT } = app.get(ConfigServicePort);

    const loggerService = app.get(LoggerServicePort);

    loggerService.setApplicationName(APP_NAME);

    app.useGlobalFilters(new HttpExceptionFilter(loggerService));

    app.useGlobalInterceptors(new AccessLogInterceptor(loggerService), new ContextInterceptor());

    app.useLogger(loggerService);

    app.connectMicroservice<MicroserviceOptions>(
      app.get(ServerInjectToknes.GATEWAY_HOOK_SERVICE_OPTION),
    );

    app.enableShutdownHooks();

    await app.startAllMicroservices();
    await app.listen(PORT);
    console.log(`Application is running on: ${await app.getUrl()}`);
  }

  public static new(): Application {
    return new Application();
  }
}

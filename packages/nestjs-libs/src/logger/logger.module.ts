import { Module, Global } from "@nestjs/common";
import { LoggerService } from "./logger.service";
import { LoggerServicePort } from "./logger.service.port";

@Global()
@Module({
  providers: [
    {
      provide: LoggerServicePort,
      useFactory: () => {
        const logger = new LoggerService("");
        logger.connect("info");
        return logger;
      },
    },
  ],
  exports: [LoggerServicePort],
})
export class LoggerModule {}

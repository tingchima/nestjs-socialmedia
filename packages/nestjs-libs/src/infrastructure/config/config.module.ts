import { Module } from "@nestjs/common";
import { ConfigModule as NestConfigModule } from "@nestjs/config";
import { ConfigServicePort } from "./interfaces/config.service.port";
import { ConfigService } from "./config.service";

@Module({
  imports: [NestConfigModule.forRoot({ envFilePath: [".env"] })],
  providers: [
    {
      provide: ConfigServicePort,
      useClass: ConfigService,
    },
  ],
  exports: [ConfigServicePort],
})
export class ConfigModule {}

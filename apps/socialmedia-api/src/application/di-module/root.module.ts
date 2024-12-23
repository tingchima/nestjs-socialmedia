import { Module, NestModule, MiddlewareConsumer, OnApplicationShutdown } from "@nestjs/common";
import { ContextMiddleware } from "@repo/nestjs-libs";
import { UserAccountModule } from "@application/di-module/user.account.module";
import { InfrastructureModule } from "@application/di-module/infrasturcture.module";
import { AuthorizationModule } from "@application/di-module/authorization.module";
import { ChatroomModule } from "./chatroom.module";
import { MediaModule } from "./media.module";

@Module({
  imports: [
    InfrastructureModule,
    AuthorizationModule,
    UserAccountModule,
    ChatroomModule,
    MediaModule,
  ],
  controllers: [],
  providers: [ContextMiddleware],
  exports: [ContextMiddleware],
})
export class RootModule implements NestModule, OnApplicationShutdown {
  configure(consumer: MiddlewareConsumer): any {
    consumer.apply(ContextMiddleware).forRoutes("*");
  }

  onApplicationShutdown(signal: string) {
    console.log(signal); // e.g. "SIGINT"
  }
}

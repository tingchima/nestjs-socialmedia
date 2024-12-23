import { Module } from "@nestjs/common";

import { InfrastructureModule } from "@application/di-module/infrastructure.module";
import { ChatroomModule } from "@application/di-module/chatroom.module";

@Module({
  imports: [InfrastructureModule, ChatroomModule],
  controllers: [],
  providers: [],
  exports: [],
})
export class RootModule {}

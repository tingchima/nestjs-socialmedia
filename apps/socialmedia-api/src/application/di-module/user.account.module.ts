import { Module, Provider } from "@nestjs/common";

import { UserAccountController } from "@application/api-route/http/v1/controller/user.account.controller";
import { UserInjectTokens } from "@core/domain/user/user.inject.tokens";
import { UserService } from "@core/service/user/user.service";
import { UserMapper } from "@infrastructure/adapter/persistence/knex/mapper/user.mapper";
import { KnexUserRepositoryAdapter } from "@infrastructure/adapter/persistence/knex/repository/knex.user.repository.adapter";

const persistenceProviders: Provider[] = [
  {
    provide: UserInjectTokens.USER_REPOSITORY,
    useClass: KnexUserRepositoryAdapter,
  },
];

const mapperProviders: Provider[] = [
  {
    provide: UserInjectTokens.USER_MAPPER,
    useClass: UserMapper,
  },
];

const useCaseProviders: Provider[] = [
  {
    provide: UserInjectTokens.USER_USE_CASE,
    useClass: UserService,
  },
];

@Module({
  controllers: [UserAccountController],
  providers: [...mapperProviders, ...persistenceProviders, ...useCaseProviders],
  exports: [UserInjectTokens.USER_USE_CASE, UserInjectTokens.USER_REPOSITORY],
})
export class UserAccountModule {}

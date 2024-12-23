import { Global, Module, Provider } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";

import { UserAccountModule } from "@application/di-module/user.account.module";
import { ConfigModule, ConfigServicePort } from "@repo/nestjs-libs";
import { AuthorizationController } from "@application/api-route/http/v1/controller/authorization.controller";
import { AuthorizationService } from "@application/api-route/authorization/authorization.service";
import { JWT_STRATEGY, JwtStrategy } from "@application/api-route/http/strategy/jwt.strategy";
import { BASIC_STRATEGY, BasicStrategy } from "@application/api-route/http/strategy/basic.strategy";
import { AuthInjectTokens } from "@application/api-route/authorization/auth.inject.tokens";

const passportProviders: Provider[] = [
  {
    provide: BASIC_STRATEGY,
    useClass: BasicStrategy,
  },
  {
    provide: JWT_STRATEGY,
    useClass: JwtStrategy,
  },
];

const serviceProviders: Provider[] = [
  {
    provide: AuthInjectTokens.AUTH_SERVICE,
    useClass: AuthorizationService,
  },
];

@Global()
@Module({
  imports: [
    ConfigModule,
    UserAccountModule,
    /**
     * Jwt
     */
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigServicePort) => ({
        secret: configService.JWT.SECRET,
        signOptions: {
          issuer: configService.JWT.ISSUER,
          expiresIn: configService.JWT.EXPIRES_IN_SEC,
        },
      }),
      inject: [ConfigServicePort],
    }),
  ],
  controllers: [AuthorizationController],
  providers: [...passportProviders, ...serviceProviders],
  exports: [AuthInjectTokens.AUTH_SERVICE],
})
export class AuthorizationModule {}

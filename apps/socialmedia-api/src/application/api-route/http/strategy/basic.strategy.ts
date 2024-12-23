import { Inject, Injectable, UnauthorizedException } from "@nestjs/common";
import { Strategy } from "passport-local";
import { PassportStrategy } from "@nestjs/passport";

import { AuthorizationService } from "@application/api-route/authorization/authorization.service";
import { SignedUser } from "@application/api-route/authorization/types";
import { ConfigServicePort } from "@repo/nestjs-libs";
import { AuthInjectTokens } from "@application/api-route/authorization/auth.inject.tokens";

export const BASIC_STRATEGY = "BASIC_STRATEGY";

@Injectable()
export class BasicStrategy extends PassportStrategy(Strategy, BASIC_STRATEGY) {
  constructor(
    @Inject(AuthInjectTokens.AUTH_SERVICE)
    private readonly authService: AuthorizationService,

    private readonly _configService: ConfigServicePort,
  ) {
    super({
      usernameField: _configService.BASIC.USERNAME_FIELD,
      passwordField: _configService.BASIC.PASSWORD_FIELD,
    });
  }

  public async validate(username: string, password: string): Promise<SignedUser> {
    const user = await this.authService.validateUser(username, password);
    if (user === null || user === undefined) {
      throw new UnauthorizedException();
    }

    return user;
  }
}

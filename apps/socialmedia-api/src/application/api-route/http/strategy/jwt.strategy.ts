import { Inject, Injectable } from "@nestjs/common";
import { Strategy, ExtractJwt } from "passport-jwt";
import { PassportStrategy } from "@nestjs/passport";

import { AuthorizationService } from "@application/api-route/authorization/authorization.service";
import { SignedJwtPayload, SignedUser } from "@application/api-route/authorization/types";
import { AuthInjectTokens } from "@application/api-route/authorization/auth.inject.tokens";
import { ConfigServicePort } from "@repo/nestjs-libs";

export const JWT_STRATEGY = "JWT_STRATEGY";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, JWT_STRATEGY) {
  constructor(
    @Inject(AuthInjectTokens.AUTH_SERVICE)
    private readonly authService: AuthorizationService,

    private readonly configService: ConfigServicePort,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.JWT.SECRET,
    });
  }

  public async validate(params: SignedJwtPayload): Promise<SignedUser> {
    const user = await this.authService.getUserById(params.userId);
    if (user === null || user === undefined) {
      throw Error("signed jwt user is empty");
    }

    return {
      userId: user.getId(),
      userEmail: user.getEmail(),
      userRole: user.getRole(),
    };
  }
}

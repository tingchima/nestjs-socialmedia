import { Body, Controller, Inject, Post } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";

import { routesV1 } from "@application/api-route/routes";
import { AuthorizationService } from "@application/api-route/authorization/authorization.service";
import { SignedJwt } from "@application/api-route/authorization/types";
import { BasicTokenRequired } from "@application/api-route/http/basic.token.required";
import { AuthInjectTokens } from "@application/api-route/authorization/auth.inject.tokens";

export class TokenCreateSchemas {
  public email: string;
}

@ApiTags(routesV1.auth.root)
@Controller(routesV1.name)
export class AuthorizationController {
  constructor(
    @Inject(AuthInjectTokens.AUTH_SERVICE)
    private readonly authService: AuthorizationService,
  ) {}

  @Post(routesV1.auth.create)
  @BasicTokenRequired()
  async createToken(@Body() body: TokenCreateSchemas): Promise<SignedJwt> {
    return await this.authService.signToken(body.email);
  }
}

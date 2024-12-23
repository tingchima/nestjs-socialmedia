import { Injectable, CanActivate, ExecutionContext, Inject } from "@nestjs/common";

import { AuthorizationService } from "@application/api-route/authorization/authorization.service";
import { AuthInjectTokens } from "@application/api-route/authorization/auth.inject.tokens";

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    @Inject(AuthInjectTokens.AUTH_SERVICE)
    private readonly authService: AuthorizationService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const type = context.getType();
    const prefix = "Bearer ";

    let header: any;
    if (type === "rpc") {
      const metadata = context.getArgByIndex(1);
      if (!metadata) {
        return false;
      }
      header = metadata.get("Authorization")[0];
    }

    if (!header || !header.includes(prefix)) {
      return false;
    }

    const token = header.slice(header.indexOf(" ") + 1);

    return await this.authService.verify(token);
  }
}

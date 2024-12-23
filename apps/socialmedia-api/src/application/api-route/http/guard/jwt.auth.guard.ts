import { ExecutionContext, Injectable } from "@nestjs/common";

import { AuthGuard } from "@nestjs/passport";
import { JWT_STRATEGY } from "@application/api-route/http/strategy/jwt.strategy";

@Injectable()
export class JwtAuthGuard extends AuthGuard(JWT_STRATEGY) {
  canActivate(context: ExecutionContext) {
    return super.canActivate(context);
  }
}

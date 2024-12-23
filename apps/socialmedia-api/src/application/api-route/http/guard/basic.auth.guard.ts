import { ExecutionContext, Injectable } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";

import { BASIC_STRATEGY } from "@application/api-route/http/strategy/basic.strategy";

@Injectable()
export class BasicAuthGuard extends AuthGuard(BASIC_STRATEGY) {
  canActivate(context: ExecutionContext) {
    return super.canActivate(context);
  }
}

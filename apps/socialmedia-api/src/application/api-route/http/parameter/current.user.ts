import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { Request } from "express";

import { SignedUser } from "@application/api-route/authorization/types";

export const CurrentUser: () => any = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request: Request & { user: SignedUser } = ctx.switchToHttp().getRequest();

    return request.user;
  },
);

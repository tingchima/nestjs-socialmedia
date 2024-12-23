import { applyDecorators, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "@application/api-route/http/guard/jwt.auth.guard";

export const BearerTokenRequired = (): ((...args: any) => void) => {
  return applyDecorators(UseGuards(JwtAuthGuard));
};
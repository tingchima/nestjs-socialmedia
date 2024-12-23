import { applyDecorators, UseGuards } from "@nestjs/common";

import { BasicAuthGuard } from "@application/api-route/http/guard/basic.auth.guard";

export const BasicTokenRequired = (): ((...args: any) => void) => {
  return applyDecorators(UseGuards(BasicAuthGuard));
};

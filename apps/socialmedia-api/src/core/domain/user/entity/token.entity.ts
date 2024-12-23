import { IsString } from "class-validator";

import { Optional } from "@repo/nestjs-libs";

export type TokenEntityCreateParams = {
  accessTokenStr: string;
  refreshTokenStr?: string;
};

export class TokenEntity {
  @IsString()
  private accessTokenStr: string;

  @IsString()
  private refreshTokenStr: Optional<string>;

  constructor(params: TokenEntityCreateParams) {
    this.accessTokenStr = params.accessTokenStr;
    this.refreshTokenStr = params.refreshTokenStr;
  }
}

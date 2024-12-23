import { ApiProperty } from "@nestjs/swagger";

import { UserRole } from "@core/domain/user/entity/enum/user.enum";

export class UserCreateBodySchema {
  @ApiProperty({ type: "string" })
  public email: string;

  @ApiProperty({ type: "string" })
  public name: string;

  @ApiProperty({ type: "string" })
  public password: string;

  @ApiProperty({ type: "string" })
  public role: UserRole;
}

export class UserCreateResponseSchema {
  @ApiProperty({ type: "string" })
  public email: string;

  @ApiProperty({ type: "string" })
  public name: string;

  @ApiProperty({ type: "string" })
  public password: string;

  @ApiProperty({ type: "string" })
  public role: UserRole;

  @ApiProperty({ type: "boolean" })
  public enabled: boolean;
}

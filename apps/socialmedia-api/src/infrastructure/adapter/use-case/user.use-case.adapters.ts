import { Exclude, Expose, plainToClass } from "class-transformer";
import { IsIn, IsNumber, IsString } from "class-validator";

import { UserCreatePort, UserGetPort } from "@core/domain/user/interface/user.use-case.port";
import { UserRole, userRoleArray } from "@core/domain/user/entity/enum/user.enum";
import { UseCaseValidatorAdapter } from "@repo/nestjs-libs";

@Exclude()
export class UserGetAdapter extends UseCaseValidatorAdapter implements UserGetPort {
  @Expose()
  @IsNumber()
  public userId: number;

  public static async new(params: UserGetPort): Promise<UserGetAdapter> {
    const adapter: UserGetAdapter = plainToClass(UserGetAdapter, params);

    await adapter.validate();

    return adapter;
  }
}

@Exclude()
export class UserCreateAdapter extends UseCaseValidatorAdapter implements UserCreatePort {
  @Expose()
  @IsString()
  public email: string;

  @Expose()
  @IsString()
  public name: string;

  @Expose()
  @IsString()
  public password: string;

  @Expose()
  @IsIn(userRoleArray)
  public role: UserRole;

  public static async new(params: UserCreatePort): Promise<UserCreateAdapter> {
    const adapter: UserCreateAdapter = plainToClass(UserCreateAdapter, params);

    await adapter.validate();

    return adapter;
  }
}

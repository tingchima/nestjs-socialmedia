import { Exclude, Expose, plainToClass } from "class-transformer";

import { UserRole } from "@core/domain/user/entity/enum/user.enum";
import { UserEntity } from "@core/domain/user/entity/user.entity";

@Exclude()
export class UserUseCaseDto {
  @Expose()
  public id: number;

  @Expose()
  public email: string;

  @Expose()
  public name: string;

  @Expose()
  public password: string;

  @Expose()
  public enabled: boolean;

  @Expose()
  public role: UserRole;

  @Expose()
  public createdAt: Date;

  public static newFromUser(user: UserEntity): UserUseCaseDto {
    return plainToClass(UserUseCaseDto, user);
  }

  public static newListFromUsers(users: UserEntity[]): UserUseCaseDto[] {
    return users.map((user) => this.newFromUser(user));
  }
}

import { UserEntity } from "@core/domain/user/entity/user.entity";
import { Optional } from "@repo/nestjs-libs";

export interface UserRepositoryPort {
  findUserByEmail(email: string): Promise<Optional<UserEntity>>;
}

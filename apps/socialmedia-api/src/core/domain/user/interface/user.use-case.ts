import { UserUseCaseDto } from "@core/domain/user/dto/user.use-case.dto";
import { UserCreatePort, UserGetPort } from "@core/domain/user/interface/user.use-case.port";

export interface UserUseCase {
  getUser(params: UserGetPort): Promise<UserUseCaseDto>;

  createUser(params: UserCreatePort): Promise<UserUseCaseDto>;
}

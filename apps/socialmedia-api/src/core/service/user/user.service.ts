import { Inject } from "@nestjs/common";

import { UserUseCase } from "@core/domain/user/interface/user.use-case";
import { UserInjectTokens } from "@core/domain/user/user.inject.tokens";
import { UserUseCaseDto } from "@core/domain/user/dto/user.use-case.dto";
import { UserCreatePort, UserGetPort } from "@core/domain/user/interface/user.use-case.port";
import { KnexUserRepositoryAdapter } from "@infrastructure/adapter/persistence/knex/repository/knex.user.repository.adapter";
import { UserEntity } from "@core/domain/user/entity/user.entity";
import { AppException, Optional, ResourceNotFound } from "@repo/nestjs-libs";

export class UserService implements UserUseCase {
  constructor(
    @Inject(UserInjectTokens.USER_REPOSITORY)
    private readonly userRepository: KnexUserRepositoryAdapter,
  ) {}

  public async getUser(params: UserGetPort): Promise<UserUseCaseDto> {
    const user: Optional<UserEntity> = await this.userRepository.findOneById(params.userId);
    if (!user) {
      throw AppException.new({ code: ResourceNotFound });
    }

    return UserUseCaseDto.newFromUser(user);
  }

  public async createUser(params: UserCreatePort): Promise<UserUseCaseDto> {
    const user: UserEntity = await UserEntity.new({
      email: params.email,
      dieplayName: params.name,
      password: params.password,
      role: params.role,
    });

    const createdId: { id: number } = await this.userRepository.create(user);

    user.buildId(createdId);

    return UserUseCaseDto.newFromUser(user);
  }
}

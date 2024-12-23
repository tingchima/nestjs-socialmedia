import { Inject, Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";

import { UserInjectTokens } from "@core/domain/user/user.inject.tokens";
import { KnexUserRepositoryAdapter } from "@infrastructure/adapter/persistence/knex/repository/knex.user.repository.adapter";
import { Nullable, Optional } from "@repo/nestjs-libs";
import { UserEntity } from "@core/domain/user/entity/user.entity";
import {
  SignedJwt,
  SignedJwtPayload,
  SignedUser,
} from "@application/api-route/authorization/types";

@Injectable()
export class AuthorizationService {
  constructor(
    @Inject(UserInjectTokens.USER_REPOSITORY)
    private readonly userRepository: KnexUserRepositoryAdapter,

    private readonly jwtService: JwtService,
  ) {}

  public async getUserById(id: number): Promise<Optional<UserEntity>> {
    return await this.userRepository.findOneById(id);
  }

  public async signToken(userEmail: string): Promise<SignedJwt> {
    const user: Optional<UserEntity> = await this.userRepository.findUserByEmail(userEmail);
    if (!user) {
      throw new UnauthorizedException();
    }

    const signedJwt: SignedJwtPayload = {
      userId: user.getId(),
      userEmail: user.getEmail(),
      userRole: user.getRole(),
    };

    return {
      accessToken: this.jwtService.sign(signedJwt),
    } as SignedJwt;
  }

  public async verify(token: string): Promise<boolean> {
    const payload = await this.jwtService.verifyAsync(token);
    return payload;
  }

  public async validateUser(username: string, password: string): Promise<Nullable<SignedUser>> {
    const user: Optional<UserEntity> = await this.userRepository.findUserByEmail(username);
    if (user) {
      if (await user.isCorrectPassword(password)) {
        return {
          userId: user.getId(),
          userEmail: user.getEmail(),
          userRole: user.getRole(),
        };
      }
    }

    return null;
  }
}

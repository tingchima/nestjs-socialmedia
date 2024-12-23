import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Inject,
  Param,
  ParseIntPipe,
  Post,
} from "@nestjs/common";
import { ApiBasicAuth, ApiBearerAuth, ApiBody, ApiTags } from "@nestjs/swagger";

import { UserInjectTokens } from "@core/domain/user/user.inject.tokens";
import { UserUseCase } from "@core/domain/user/interface/user.use-case";
import { UserUseCaseDto } from "@core/domain/user/dto/user.use-case.dto";
import {
  UserCreateAdapter,
  UserGetAdapter,
} from "@infrastructure/adapter/use-case/user.use-case.adapters";
import { routesV1 } from "@application/api-route/routes";
import { BearerTokenRequired } from "@application/api-route/http/bearer.token.required";
import { CurrentUser } from "@application/api-route/http/parameter/current.user";
import { SignedUser } from "@application/api-route/authorization/types";
import { UserCreateBodySchema } from "@application/api-route/http/v1/schema/user.schemas";

@ApiTags(routesV1.users.root)
@Controller(routesV1.name)
export class UserAccountController {
  constructor(
    @Inject(UserInjectTokens.USER_USE_CASE)
    private readonly userUseCase: UserUseCase,
  ) {}

  @Get(routesV1.users.getMe)
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @BearerTokenRequired()
  public async getMe(@CurrentUser() currentUser: SignedUser): Promise<UserUseCaseDto> {
    const adapter: UserGetAdapter = await UserGetAdapter.new({
      userId: currentUser.userId,
    });

    const user: UserUseCaseDto = await this.userUseCase.getUser(adapter);

    return {
      id: user.id,
      email: user.email,
      name: user.name,
      password: user.password,
      enabled: user.enabled,
      role: user.role,
      createdAt: user.createdAt,
    };
  }

  @Get(routesV1.users.get)
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @BearerTokenRequired()
  public async getUser(@Param("id", ParseIntPipe) id: number): Promise<UserUseCaseDto> {
    const adapter: UserGetAdapter = await UserGetAdapter.new({ userId: id });

    const user: UserUseCaseDto = await this.userUseCase.getUser(adapter);

    return {
      id: user.id,
      email: user.email,
      name: user.name,
      password: user.password,
      enabled: user.enabled,
      role: user.role,
      createdAt: user.createdAt,
    };
  }

  @Post(routesV1.users.create)
  @HttpCode(HttpStatus.CREATED)
  @ApiBasicAuth()
  @ApiBody({ type: UserCreateBodySchema })
  public async creatUser(@Body() body: UserCreateBodySchema): Promise<UserUseCaseDto> {
    const adapter: UserCreateAdapter = await UserCreateAdapter.new({
      email: body.email,
      name: body.name,
      password: body.password,
      role: body.role,
    });

    const user: UserUseCaseDto = await this.userUseCase.createUser(adapter);

    return {
      id: user.id,
      email: user.email,
      name: user.name,
      password: user.password,
      enabled: user.enabled,
      role: user.role,
      createdAt: user.createdAt,
    };
  }
}

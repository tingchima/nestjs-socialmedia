import { Body, Controller, HttpCode, HttpStatus, Inject, Post } from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";

import { routesV1 } from "@application/api-route/routes";
import { BearerTokenRequired } from "@application/api-route/http/bearer.token.required";
import { CurrentUser } from "@application/api-route/http/parameter/current.user";
import { SignedUser } from "@application/api-route/authorization/types";
import { ChatroomInjectTokens } from "@core/domain/chatroom/chatroom.inject.tokens";
import { MemberCreateBodySchema } from "@application/api-route/http/v1/schema/member.schemas";
import { MemberCreateAdapter } from "@infrastructure/adapter/use-case/member.use-case.adapters";
import { MemberUseCase } from "@core/domain/chatroom/interface/member.use-case";

@ApiTags(routesV1.members.root)
@Controller(routesV1.name)
export class MemberController {
  constructor(
    @Inject(ChatroomInjectTokens.MEMBER_USE_CASE)
    private readonly memberUseCase: MemberUseCase,
  ) {}

  @Post(routesV1.members.create)
  @HttpCode(HttpStatus.CREATED)
  @ApiBearerAuth()
  @BearerTokenRequired()
  async createMember(
    @CurrentUser() currentUser: SignedUser,
    @Body() body: MemberCreateBodySchema,
  ): Promise<void> {
    const adapter: MemberCreateAdapter = await MemberCreateAdapter.new({
      channelId: body.channelId,
      userId: currentUser.userId,
    });

    await this.memberUseCase.createMember(adapter);
  }
}

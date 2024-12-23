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
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";

import { routesV1 } from "@application/api-route/routes";
import { BearerTokenRequired } from "@application/api-route/http/bearer.token.required";
import { CurrentUser } from "@application/api-route/http/parameter/current.user";
import { SignedUser } from "@application/api-route/authorization/types";
import { ChatroomInjectTokens } from "@core/domain/chatroom/chatroom.inject.tokens";
import { ChannelUseCase } from "@core/domain/chatroom/interface/channel.use-case";
import { ChannelUseCaseDto } from "@core/domain/chatroom/dto/channel.use-case.dto";
import {
  ChannelCreateAdapter,
  ChannelGetAdapter,
} from "@infrastructure/adapter/use-case/channel.use-case.adapters";
import { ChannelCreateBodySchema } from "@application/api-route/http/v1/schema/channel.schemas";

@ApiTags(routesV1.channels.root)
@Controller(routesV1.name)
export class ChannelController {
  constructor(
    @Inject(ChatroomInjectTokens.CHANNEL_USE_CASE)
    private readonly channelUseCase: ChannelUseCase,
  ) {}

  @Get(routesV1.channels.get)
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @BearerTokenRequired()
  async getChannel(
    @CurrentUser() currentUser: SignedUser,
    @Param("id", ParseIntPipe) id: number,
  ): Promise<ChannelUseCaseDto> {
    const adapter: ChannelGetAdapter = await ChannelGetAdapter.new({
      channelId: id,
      userId: currentUser.userId,
    });

    const channel: ChannelUseCaseDto = await this.channelUseCase.getChannel(adapter);

    return {
      id: channel.id,
      displayName: channel.displayName,
      avatarPath: channel.avatarPath,
      createdAt: channel.createdAt,
      updatedAt: channel.updatedAt,
    };
  }

  @Post(routesV1.channels.create)
  @HttpCode(HttpStatus.CREATED)
  @ApiBearerAuth()
  @BearerTokenRequired()
  async createChannel(@Body() body: ChannelCreateBodySchema): Promise<ChannelUseCaseDto> {
    const adapter: ChannelCreateAdapter = await ChannelCreateAdapter.new({
      displayName: body.displayName,
      type: body.type,
      avatarPath: body.avatarPath,
    });

    const channel: ChannelUseCaseDto = await this.channelUseCase.createChannel(adapter);

    return {
      id: channel.id,
      displayName: channel.displayName,
      avatarPath: channel.avatarPath,
      createdAt: channel.createdAt,
      updatedAt: channel.updatedAt,
    };
  }
}

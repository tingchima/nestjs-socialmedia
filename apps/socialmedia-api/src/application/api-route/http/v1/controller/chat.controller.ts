import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Inject,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
} from "@nestjs/common";

import { routesV1 } from "@application/api-route/routes";
import { ChatroomInjectTokens } from "@core/domain/chatroom/chatroom.inject.tokens";
import { ChatUseCaseDto } from "@core/domain/chatroom/dto/chat.use-case.dto";
import { ChatUseCase } from "@core/domain/chatroom/interface/chat.use-case";
import {
  ChatCreateAdapter,
  ChatGetAdapter,
  ChatGetListAdapter,
  ChatRemoveAdapter,
  ChatRetractAdapter,
  ChatSearchListAdapter,
} from "@infrastructure/adapter/use-case/chat.use-case.adapters";
import {
  ChatCreateBodySchema,
  ChatGetListQuerySchema,
  ChatRemoveBodySchema,
  ChatRetractBodySchema,
  ChatSearchListQuerySchema,
} from "@application/api-route/http/v1/schema/chat.schemas";
import { BearerTokenRequired } from "@application/api-route/http/bearer.token.required";
import { CurrentUser } from "@application/api-route/http/parameter/current.user";
import { SignedUser } from "@application/api-route/authorization/types";
import { nextTokenId } from "@application/api-route/response/nest.token.id";

@Controller(routesV1.name)
export class ChatController {
  constructor(
    @Inject(ChatroomInjectTokens.CHAT_USE_CASE)
    private readonly chatUseCae: ChatUseCase,
  ) {}

  @Post(routesV1.chats.create)
  @HttpCode(HttpStatus.CREATED)
  @BearerTokenRequired()
  public async createChat(
    @CurrentUser() currentUser: SignedUser,
    @Body() body: ChatCreateBodySchema,
  ): Promise<ChatUseCaseDto> {
    const adapter: ChatCreateAdapter = await ChatCreateAdapter.new({
      channelId: body.channelId,
      senderId: currentUser.userId,
      text: body.text,
    });

    const chat: ChatUseCaseDto = await this.chatUseCae.createChat(adapter);

    return chat;
  }

  @Get(routesV1.chats.get)
  @HttpCode(HttpStatus.OK)
  @BearerTokenRequired()
  public async getChat(
    @Param("id", ParseIntPipe) id: number,
    @CurrentUser() currentUser: SignedUser,
    @Query("channelId", ParseIntPipe) channelId: number,
  ): Promise<ChatUseCaseDto> {
    const adapter: ChatGetAdapter = await ChatGetAdapter.new({
      id,
      channelId,
      senderId: currentUser.userId,
    });

    const chat: ChatUseCaseDto = await this.chatUseCae.getChat(adapter);

    return chat;
  }

  @Get(routesV1.chats.list)
  @HttpCode(HttpStatus.OK)
  @BearerTokenRequired()
  public async getChatList(
    @CurrentUser() currentUser: SignedUser,
    @Query() query: ChatGetListQuerySchema,
  ): Promise<{ data: ChatUseCaseDto[]; lastTokenId: string }> {
    const adapter: ChatGetListAdapter = await ChatGetListAdapter.new({
      channelId: parseInt(query.channelId),
      userId: currentUser.userId,
      startId: parseInt(query.startId, 10),
      endId: query.endId ? parseInt(query.endId, 10) : 0,
      perPage: parseInt(query.perPage),
      scrolling: query.scrolling,
    });

    const { chats, lastTokenId } = await this.chatUseCae.getChatList(adapter);

    return { data: chats, lastTokenId: lastTokenId.toString() };
  }

  @Delete(routesV1.chats.remove)
  @HttpCode(HttpStatus.NO_CONTENT)
  @BearerTokenRequired()
  public async removeChat(
    @CurrentUser() currentUser: SignedUser,
    @Body() body: ChatRemoveBodySchema,
  ): Promise<void> {
    const adapter: ChatRemoveAdapter = await ChatRemoveAdapter.new({
      ids: body.chatIds,
      channelId: body.channelId,
      isAll: body.isAll,
      userId: currentUser.userId,
    });

    await this.chatUseCae.removeChat(adapter);
  }

  @Put(routesV1.chats.retract)
  @HttpCode(HttpStatus.NO_CONTENT)
  @BearerTokenRequired()
  public async retractChat(
    @CurrentUser() currentUser: SignedUser,
    @Body() body: ChatRetractBodySchema,
  ): Promise<void> {
    const adapter: ChatRetractAdapter = await ChatRetractAdapter.new({
      ids: body.chatIds,
      channelId: body.channelId,
      userId: currentUser.userId,
    });

    await this.chatUseCae.retractChat(adapter);
  }

  @Get(routesV1.chats.search)
  @HttpCode(HttpStatus.OK)
  @BearerTokenRequired()
  public async searchChatList(
    @CurrentUser() currentUser: SignedUser,
    @Query() query: ChatSearchListQuerySchema,
  ): Promise<{ data: ChatUseCaseDto[]; nextTokenId: string }> {
    const adapter: ChatSearchListAdapter = await ChatSearchListAdapter.new({
      channelId: parseInt(query.channelId),
      userId: currentUser.userId,
      search: query.search,
      page: parseInt(query.page),
      perPage: parseInt(query.perPage),
      order: query.order,
    });

    const { chats, total } = await this.chatUseCae.searchChatList(adapter);

    return {
      data: chats,
      nextTokenId: nextTokenId({ page: adapter.page, perPage: adapter.perPage, total }),
    };
  }
}

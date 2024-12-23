import { Exclude, Expose, plainToClass } from "class-transformer";

import { ChatEntity } from "@core/domain/chatroom/entity/chat.entity";

@Exclude()
export class ChatUseCaseDto {
  @Expose()
  public id: number;

  @Expose()
  public channelId: number;

  @Expose()
  public senderId: number;

  @Expose()
  public text: string;

  @Expose()
  public ignoredUserIds: string[];

  @Expose()
  public isRetract: boolean;

  @Expose()
  public createdAt: Date;

  @Expose()
  public updatedAt: Date;

  @Expose()
  public publishAt: Date;

  @Expose()
  public deliveredAt: Date;

  @Expose()
  public ackedAt: Date;

  public static newFromChat(entity: ChatEntity): ChatUseCaseDto {
    return plainToClass(ChatUseCaseDto, entity);
  }

  public static newListFromChats(entities: ChatEntity[]): ChatUseCaseDto[] {
    return entities.map((entity) => this.newFromChat(entity));
  }
}

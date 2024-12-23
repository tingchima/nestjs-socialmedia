import { Exclude, Expose, plainToClass } from "class-transformer";
import { IsArray } from "class-validator";

import { UseCaseValidatorAdapter } from "@repo/nestjs-libs";
import { ChatEntityNewParams } from "@core/domain/chatroom/entity/chat.entity";
import { ChatSearchInsertBulkPort } from "@core/domain/chatroom/interface/chat.search.use-case.port";

@Exclude()
export class ChatSearchInsertBulkAdapter
  extends UseCaseValidatorAdapter
  implements ChatSearchInsertBulkPort
{
  @Expose()
  @IsArray()
  public newParams: ChatEntityNewParams[];

  public static async new(payload: ChatSearchInsertBulkPort): Promise<ChatSearchInsertBulkAdapter> {
    const adapter: ChatSearchInsertBulkAdapter = plainToClass(ChatSearchInsertBulkAdapter, payload);

    await adapter.validate();

    return adapter;
  }
}

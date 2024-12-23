import { Scrolling } from "@core/domain/chatroom/entity/enum/scrolling";
import { ApiProperty } from "@nestjs/swagger";
import { Order } from "@repo/nestjs-libs";

export class ChatCreateBodySchema {
  @ApiProperty({ type: "number" })
  public channelId: number;

  @ApiProperty({ type: "string" })
  public text: string;
}

export class ChatGetListQuerySchema {
  @ApiProperty({ type: "string", required: true })
  public channelId: string;

  @ApiProperty({ type: "string" })
  public startId: string;

  @ApiProperty({ type: "string" })
  public endId: string;

  @ApiProperty({ type: "string", required: true })
  public perPage: string;

  @ApiProperty({ type: "string", required: true })
  public scrolling: Scrolling;
}

export class ChatRemoveBodySchema {
  @ApiProperty({ type: "number" })
  public channelId: number;

  @ApiProperty({ type: "boolean" })
  public isAll: boolean;

  @ApiProperty({ type: "array" })
  public chatIds: number[];
}

export class ChatRetractBodySchema {
  @ApiProperty({ type: "number" })
  public channelId: number;

  @ApiProperty({ type: "array" })
  public chatIds: number[];
}

export class ChatSearchListQuerySchema {
  @ApiProperty({ type: "string", required: true })
  public channelId: string;

  @ApiProperty({ type: "string", required: true })
  public search: string;

  @ApiProperty({ type: "string", required: true })
  public page: string;

  @ApiProperty({ type: "string", required: true })
  public perPage: string;

  @ApiProperty({ type: "string", required: true })
  public order: Order;
}

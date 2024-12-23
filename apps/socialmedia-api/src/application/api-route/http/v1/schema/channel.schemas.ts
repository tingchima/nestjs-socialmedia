import { ApiProperty } from "@nestjs/swagger";

import { ChannelType } from "@core/domain/chatroom/entity/enum/channel.type";

export class ChannelCreateBodySchema {
  @ApiProperty({ type: "string" })
  public displayName: string;

  @ApiProperty({ type: "string" })
  public type: ChannelType;

  @ApiProperty({ type: "string" })
  public avatarPath: string;
}

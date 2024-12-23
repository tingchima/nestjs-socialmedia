import { ApiProperty } from "@nestjs/swagger";

export class MemberCreateBodySchema {
  @ApiProperty({ type: "number" })
  public channelId: number;
}

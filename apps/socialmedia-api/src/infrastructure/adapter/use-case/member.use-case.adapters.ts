import { Exclude, Expose, plainToClass } from "class-transformer";
import { IsNumber } from "class-validator";

import { UseCaseValidatorAdapter } from "@repo/nestjs-libs";
import { MemberCreatePort } from "@core/domain/chatroom/interface/member.use-case.ports";

@Exclude()
export class MemberCreateAdapter extends UseCaseValidatorAdapter implements MemberCreatePort {
  @Expose()
  @IsNumber()
  public channelId: number;

  @Expose()
  @IsNumber()
  public userId: number;

  public static async new(params: MemberCreatePort): Promise<MemberCreateAdapter> {
    const adapter: MemberCreateAdapter = plainToClass(MemberCreateAdapter, params);
    await adapter.validate();
    return adapter;
  }
}

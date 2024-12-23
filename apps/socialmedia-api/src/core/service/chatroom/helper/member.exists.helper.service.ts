import { ChatroomInjectTokens } from "@core/domain/chatroom/chatroom.inject.tokens";
import { KnexMemberRepositoryAdapter } from "@infrastructure/adapter/persistence/knex/repository/knex.member.repository.adapter";
import { Inject, Injectable } from "@nestjs/common";
import { AppException, ResourceNotFound } from "@repo/nestjs-libs";

@Injectable()
export class MemberExistsHelperService {
  constructor(
    @Inject(ChatroomInjectTokens.MEMBER_REPOSITORY)
    private readonly memberRepository: KnexMemberRepositoryAdapter,
  ) {}

  public async resolve(by: { channelId: number; userId: number }): Promise<boolean> {
    const exists: boolean = await this.memberRepository.existsMember(by);
    if (!exists) {
      throw AppException.new({
        code: ResourceNotFound,
        clientMessage: `member ${by.userId} is not found in channel ${by.channelId}`,
      });
    }
    return exists;
  }
}

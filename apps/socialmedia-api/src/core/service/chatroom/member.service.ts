import { Inject, Injectable } from "@nestjs/common";

import { ChatroomInjectTokens } from "@core/domain/chatroom/chatroom.inject.tokens";
import { KnexMemberRepositoryAdapter } from "@infrastructure/adapter/persistence/knex/repository/knex.member.repository.adapter";
import { MemberUseCase } from "@core/domain/chatroom/interface/member.use-case";
import { MemberEntity } from "@core/domain/chatroom/entity/member.entity";
import { MemberCreatePort } from "@core/domain/chatroom/interface/member.use-case.ports";

@Injectable()
export class MemberService implements MemberUseCase {
  constructor(
    @Inject(ChatroomInjectTokens.MEMBER_REPOSITORY)
    private readonly memberRepository: KnexMemberRepositoryAdapter,
  ) {}

  public async createMember(params: MemberCreatePort): Promise<void> {
    const member: MemberEntity = await MemberEntity.new({
      channelId: params.channelId,
      userId: params.userId,
    });

    await this.memberRepository.create(member);
  }
}

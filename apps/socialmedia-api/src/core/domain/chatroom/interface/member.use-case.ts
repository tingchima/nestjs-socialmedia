import { MemberCreatePort } from "@core/domain/chatroom/interface/member.use-case.ports";

export interface MemberUseCase {
  createMember(params: MemberCreatePort): Promise<void>;
}

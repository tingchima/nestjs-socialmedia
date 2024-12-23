import { RepositoryFindOptions } from "@repo/nestjs-libs";

export interface MemberRepositoryPort {
  existsMember(by: { channelId: number; userId: number }): Promise<boolean>;

  findChannelIds(by: { userId: number }, options?: RepositoryFindOptions): Promise<number[]>;

  findUserIds(by: { channelId: number }, options?: RepositoryFindOptions): Promise<number[]>;
}

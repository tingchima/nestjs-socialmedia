export const TableNameMemberModel = "members";

export interface MemberModel {
  id?: number;
  channel_id: number;
  user_id: number;
  is_admin?: boolean;
  last_read_at: Date;
  start_read_time: Date;
  created_at: Date;
  updated_at: Date;
  deleted_at: Date;
}

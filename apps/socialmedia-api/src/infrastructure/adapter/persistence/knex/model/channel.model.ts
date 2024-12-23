export const TableNameChannelModel = "channels";

export interface ChannelModel {
  id?: number;
  display_name: string;
  avatar_path?: string;
  type: string;
  last_message_time?: Date;
  created_at: Date;
  updated_at: Date;
}

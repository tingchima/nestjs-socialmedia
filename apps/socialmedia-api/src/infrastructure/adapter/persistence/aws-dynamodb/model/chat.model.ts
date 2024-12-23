export const TableNameChatModel = "chats";

export interface ChatModel {
  channel_id: number;
  created_at: string;
  updated_at: string;
  sender_id: number;
  text?: string;
  ignored_user_ids?: string[];
  is_retract?: boolean;
  publish_at: string;
  delivered_at: string;
  acked_at: string;
}

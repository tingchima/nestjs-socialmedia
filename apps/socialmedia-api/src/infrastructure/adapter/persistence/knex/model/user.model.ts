export const TableNameUserModel = "users";

export interface UserModel {
  id?: number;
  email: string;
  display_name: string;
  password: string;
  avatar_path?: string;
  enabled: boolean;
  role: string;
  created_at: Date;
  updated_at: Date;
}

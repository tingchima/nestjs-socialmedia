import { UserRole } from "@core/domain/user/entity/enum/user.enum";

export interface UserGetPort {
  userId: number;
}

export interface UserCreatePort {
  email: string;
  name: string;
  password: string;
  role: UserRole;
}

export interface UserEditPort {
  userId: number;
  name?: string;
  password?: string;
  role?: UserRole;
}

export interface UserRemovePort {
  userId: number;
}

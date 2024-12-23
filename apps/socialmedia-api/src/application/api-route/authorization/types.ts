import { UserRole } from "@core/domain/user/entity/enum/user.enum";

export type SignedUser = {
  userId: number;
  userEmail: string;
  userRole: UserRole;
};

export type SignedJwtPayload = {
  userId: number;
  userEmail: string;
  userRole: UserRole;
};

export type SignedJwt = {
  accessToken: string;
  refreshToken?: string;
};

export type JwtStrategyOptions = {
  secret: string;
};

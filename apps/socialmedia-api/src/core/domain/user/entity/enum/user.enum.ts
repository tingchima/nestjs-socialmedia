export enum UserRole {
  OFFICIAL = "OFFICIAL",
  NORMAL = "NORMAL",
}

export const userRoleArray = [UserRole.OFFICIAL, UserRole.NORMAL];

const userRoleLookup: { [key: string]: UserRole } = {
  OFFICIAL: UserRole.OFFICIAL,
  NORMAL: UserRole.NORMAL,
};

export function userRoleFromString(value: string): UserRole {
  return userRoleLookup[value];
}

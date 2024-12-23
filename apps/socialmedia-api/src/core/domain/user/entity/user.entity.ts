import { IsBoolean, IsDate, IsEmail, IsEnum, IsOptional, IsString } from "class-validator";

import { Entity, Nullable, Optional } from "@repo/nestjs-libs";
import { UserRole } from "./enum/user.enum";

export type UserEntityNewParams = {
  id?: number;
  email: string;
  dieplayName: string;
  password: string;
  avatarPath?: string;
  role: UserRole;
  enabled?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
};

export class UserEntity extends Entity<number> {
  @IsEmail()
  private readonly email: string;

  @IsString()
  private dieplayName: string;

  @IsString()
  private password: string;

  @IsOptional()
  @IsString()
  private avatarPath: Optional<string>;

  @IsBoolean()
  private enabled: boolean;

  @IsEnum(UserRole)
  private role: UserRole;

  @IsDate()
  private readonly createdAt: Date;

  @IsOptional()
  @IsDate()
  private updatedAt: Nullable<Date>;

  constructor(params: UserEntityNewParams) {
    super();

    this.id = params.id;
    this.email = params.email;
    this.dieplayName = params.dieplayName;
    this.password = params.password;
    this.avatarPath = params.avatarPath;
    this.enabled = true;
    this.role = params.role;
    this.createdAt = params.createdAt || new Date();
    this.updatedAt = params.updatedAt || null;
  }

  public getEmail(): string {
    return this.email;
  }

  public getName(): string {
    return this.dieplayName;
  }

  public getPassword(): string {
    return this.password;
  }

  public getAvatarPath(): Optional<string> {
    return this.avatarPath;
  }

  public getEnabled(): boolean {
    return this.enabled;
  }

  public getRole(): UserRole {
    return this.role;
  }

  public getCreatedAt(): Date {
    return this.createdAt;
  }

  public getUpdatedAt(): Nullable<Date> {
    return this.updatedAt;
  }

  public static async new(params: UserEntityNewParams): Promise<UserEntity> {
    const entity: UserEntity = new UserEntity(params);
    await entity.validate();
    return entity;
  }

  public buildId(createdId: { id: number }): UserEntity {
    super.setId(createdId.id);
    return this;
  }

  public async isCorrectPassword(password: string): Promise<boolean> {
    return password === this.password;
  }
}

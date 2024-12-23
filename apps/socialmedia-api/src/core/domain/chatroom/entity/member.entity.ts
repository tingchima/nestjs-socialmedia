import { IsBoolean, IsDate, IsNumber, IsOptional } from "class-validator";

import { Entity, Nullable, Optional } from "@repo/nestjs-libs";

export type MemberEntityNewParams = {
  id?: number;
  channelId: number;
  userId: number;
  isAdmin?: boolean;
  lastReadAt?: Date;
  startReadTime?: Date;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
};

export class MemberEntity extends Entity<number> {
  @IsNumber()
  private channelId: number;

  @IsNumber()
  private userId: number;

  @IsOptional()
  @IsBoolean()
  private isAdmin: Optional<boolean>;

  @IsOptional()
  @IsDate()
  private lastReadAt: Nullable<Date>;

  @IsOptional()
  @IsDate()
  private startReadTime: Nullable<Date>;

  @IsDate()
  private readonly createdAt: Date;

  @IsOptional()
  @IsDate()
  private updatedAt: Nullable<Date>;

  @IsOptional()
  @IsDate()
  private deletedAt: Nullable<Date>;

  constructor(params: MemberEntityNewParams) {
    super();

    this.id = params.id;
    this.channelId = params.channelId;
    this.userId = params.userId;
    this.lastReadAt = params.lastReadAt || null;
    this.startReadTime = params.startReadTime || new Date();
    this.isAdmin = params.isAdmin;
    this.createdAt = params.createdAt || new Date();
    this.updatedAt = params.updatedAt || null;
    this.deletedAt = params.deletedAt || null;
  }

  public getChannelId(): number {
    return this.channelId;
  }

  public getUserId(): number {
    return this.userId;
  }

  public getLastReadAt(): Nullable<Date> {
    return this.lastReadAt;
  }

  public getStartReadTime(): Nullable<Date> {
    return this.startReadTime;
  }

  public getIsAdmin(): Optional<boolean> {
    return this.isAdmin;
  }

  public getCreatedAt(): Date {
    return this.createdAt;
  }

  public getUpdatedAt(): Nullable<Date> {
    return this.updatedAt;
  }

  public getDeletedAt(): Nullable<Date> {
    return this.deletedAt;
  }

  public static async new(params: MemberEntityNewParams): Promise<MemberEntity> {
    const entity: MemberEntity = new MemberEntity(params);
    await entity.validate();
    return entity;
  }
}

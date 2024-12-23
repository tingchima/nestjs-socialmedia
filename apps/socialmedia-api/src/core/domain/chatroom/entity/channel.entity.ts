import { IsDate, IsEnum, IsOptional, IsString } from "class-validator";

import { Entity, Nullable, Optional } from "@repo/nestjs-libs";
import { ChannelType } from "@core/domain/chatroom/entity/enum/channel.type";

export type ChannelEntityNewParams = {
  id?: number;
  displayName: string;
  avatarPath?: string;
  type: ChannelType;
  lastMessageTime?: Date;
  createdAt?: Date;
  updatedAt?: Date;
};

export class ChannelEntity extends Entity<number> {
  @IsString()
  private displayName: string;

  @IsOptional()
  @IsString()
  private avatarPath: Optional<string>;

  @IsEnum(ChannelType)
  private type: ChannelType;

  @IsOptional()
  @IsDate()
  private lastMessageTime: Nullable<Date>;

  @IsDate()
  private readonly createdAt: Date;

  @IsOptional()
  @IsDate()
  private updatedAt: Nullable<Date>;

  constructor(params: ChannelEntityNewParams) {
    super();

    this.id = params.id;
    this.displayName = params.displayName;
    this.avatarPath = params.avatarPath;
    this.type = params.type;
    this.lastMessageTime = params.lastMessageTime || null;
    this.createdAt = params.createdAt || new Date();
    this.updatedAt = params.updatedAt || null;
  }

  public getDisplayName(): string {
    return this.displayName;
  }

  public getAvatarPath(): Optional<string> {
    return this.avatarPath;
  }

  public getType(): ChannelType {
    return this.type;
  }

  public getLasMessageTime(): Nullable<Date> {
    return this.lastMessageTime;
  }

  public getCreatedAt(): Date {
    return this.createdAt;
  }

  public getUpdatedAt(): Nullable<Date> {
    return this.updatedAt;
  }

  public static async new(params: ChannelEntityNewParams): Promise<ChannelEntity> {
    const entity: ChannelEntity = new ChannelEntity(params);
    await entity.validate();
    return entity;
  }

  public buildId(createdId: { id: number }): ChannelEntity {
    super.setId(createdId.id);
    return this;
  }
}

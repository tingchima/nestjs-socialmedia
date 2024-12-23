import { IsArray, IsBoolean, IsDate, IsNumber, IsOptional, IsString } from "class-validator";

import { Entity, Nullable, Optional } from "@repo/nestjs-libs";

export type ChatEntityNewParams = {
  id?: number;
  channelId: number;
  senderId: number;
  text?: string;
  ignoredUserIds?: string[];
  createdAt?: Date;
  updatedAt?: Date;
  isRetract?: boolean;
  publishAt?: Date;
  deliveredAt?: Date;
  ackedAt?: Date;
};

export type ChatEntityEditParams = {
  isRetract?: boolean;
};

export class ChatEntity extends Entity<number> {
  @IsNumber()
  private channelId: number;

  @IsNumber()
  private senderId: number;

  @IsOptional()
  @IsString()
  private text: Optional<string>;

  @IsArray()
  private ignoredUserIds: string[];

  @IsOptional()
  @IsBoolean()
  private isRetract: Optional<boolean>;

  @IsDate()
  private readonly createdAt: Date;

  @IsOptional()
  @IsDate()
  private updatedAt: Nullable<Date>;

  @IsOptional()
  @IsDate()
  private publishAt: Nullable<Date>;

  @IsOptional()
  @IsDate()
  private deliveredAt: Nullable<Date>;

  @IsOptional()
  @IsDate()
  private ackedAt: Nullable<Date>;

  constructor(params: ChatEntityNewParams) {
    super();

    this.createdAt = params.createdAt || new Date();
    this.id = this.createdAt.getTime();

    this.channelId = params.channelId;
    this.senderId = params.senderId;
    this.text = params.text;
    this.ignoredUserIds = params.ignoredUserIds || [];
    this.updatedAt = params.updatedAt || null;
    this.isRetract = params.isRetract;

    this.publishAt = params.publishAt || null;
    this.deliveredAt = params.deliveredAt || null;
    this.ackedAt = params.ackedAt || null;
  }

  public getChannelId(): number {
    return this.channelId;
  }

  public getSenderId(): number {
    return this.senderId;
  }

  public getText(): Optional<string> {
    return this.text;
  }

  public getIgnoredUserIds(): string[] {
    return this.ignoredUserIds;
  }

  public getIsRetracted(): Optional<boolean> {
    return this.isRetract;
  }

  public getCreatedAt(): Date {
    return this.createdAt;
  }

  public getUpdatedAt(): Nullable<Date> {
    return this.updatedAt;
  }

  public getPublishAt(): Nullable<Date> {
    return this.publishAt;
  }

  public getDeliveredAt(): Nullable<Date> {
    return this.deliveredAt;
  }

  public getAckedAt(): Nullable<Date> {
    return this.ackedAt;
  }

  public static async new(params: ChatEntityNewParams): Promise<ChatEntity> {
    const entity: ChatEntity = new ChatEntity(params);

    await entity.validate();

    return entity;
  }

  public async edit(params: ChatEntityEditParams): Promise<void> {
    const now = new Date();

    if (typeof params.isRetract !== "undefined") {
      this.isRetract = params.isRetract;
      this.updatedAt = now;
    }

    await this.validate();
  }
}

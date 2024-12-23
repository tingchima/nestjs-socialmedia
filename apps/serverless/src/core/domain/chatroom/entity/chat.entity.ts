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

  public static async new(params: ChatEntityNewParams): Promise<ChatEntity> {
    const entity: ChatEntity = new ChatEntity(params);

    return entity;
  }
}

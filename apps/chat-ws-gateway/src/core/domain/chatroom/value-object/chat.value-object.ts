import { ValueObject } from "@repo/nestjs-libs";
import { IsNumber, IsObject, IsString } from "class-validator";

export type ChatNewParams = {
  channelId: number;
  text: string;
  createdAt: Date;
};

export class Chat extends ValueObject {
  @IsNumber()
  public readonly channelId: number;

  @IsString()
  public readonly text: string;

  @IsObject()
  public readonly createdAt: Date;

  constructor(params: ChatNewParams) {
    super();

    this.channelId = params.channelId;
    this.text = params.text;
    this.createdAt = params.createdAt;
  }

  public static async new(params: ChatNewParams): Promise<Chat> {
    const chat: Chat = new Chat(params);
    await chat.validate();
    return chat;
  }
}

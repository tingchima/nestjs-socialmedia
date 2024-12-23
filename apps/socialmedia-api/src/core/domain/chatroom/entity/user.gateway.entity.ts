import { IsString } from "class-validator";

import { Entity } from "@repo/nestjs-libs";

export type WsClientNewParams = {
  clientId: string;
  fromNode: string;
};

export class WsClientEntity extends Entity<undefined> {
  @IsString()
  private clientId: string;

  @IsString()
  private fromNode: string;

  constructor(params: WsClientNewParams) {
    super();

    this.clientId = params.clientId;
    this.fromNode = params.fromNode;
  }

  public getClientId(): string {
    return this.clientId;
  }

  public getNode(): string {
    return this.fromNode;
  }

  public static async new(params: WsClientNewParams): Promise<WsClientEntity> {
    const entity: WsClientEntity = new WsClientEntity(params);
    await entity.validate();
    return entity;
  }
}

import { Optional, ValueObject } from "@repo/nestjs-libs";
import { IsOptional, IsString } from "class-validator";

export type ClientInfoNewParams = {
  node?: string;
  clientId: string;
  email?: string;
  token?: string;
};

export class ClientInfo extends ValueObject {
  @IsOptional()
  @IsString()
  public readonly node: Optional<string>;

  @IsString()
  public readonly clientId: string;

  @IsOptional()
  @IsString()
  public readonly userEmail: Optional<string>;

  @IsOptional()
  @IsString()
  public readonly accessToken: Optional<string>;

  constructor(params: ClientInfoNewParams) {
    super();

    this.node = params.node;
    this.clientId = params.clientId;
    this.userEmail = params.email;
    this.accessToken = params.token;
  }

  public static async new(params: ClientInfoNewParams): Promise<ClientInfo> {
    const signedUrl: ClientInfo = new ClientInfo(params);

    await signedUrl.validate();

    return signedUrl;
  }
}

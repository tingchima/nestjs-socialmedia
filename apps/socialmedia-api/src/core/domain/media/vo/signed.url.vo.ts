import { IsString } from "class-validator";

import { ValueObject } from "@repo/nestjs-libs";

export type SignedUrlValueObjectNewParams = {
  key: string;
  url: string;
};

export class SignedUrlValueObject extends ValueObject {
  @IsString()
  public readonly key: string;

  @IsString()
  public readonly url: string;

  constructor(params: SignedUrlValueObjectNewParams) {
    super();

    this.key = params.key;
    this.url = params.url;
  }

  public static async new(params: SignedUrlValueObjectNewParams): Promise<SignedUrlValueObject> {
    const signedUrl: SignedUrlValueObject = new SignedUrlValueObject(params);

    await signedUrl.validate();

    return signedUrl;
  }
}

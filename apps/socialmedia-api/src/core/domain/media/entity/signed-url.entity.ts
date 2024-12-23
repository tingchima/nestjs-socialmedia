import { DateTime } from "luxon";
import { v4 } from "uuid";
import { IsArray, IsNumber, IsOptional } from "class-validator";

import { Entity } from "@repo/nestjs-libs";
import { SignedUrlValueObject } from "@core/domain/media/vo/signed.url.vo";

export type SignedUrlNewParams = {
  userId: number;
  fileExtensionss?: string[];
  signedUrls?: SignedUrlValueObject[];
};

export class SignedUrlEntity extends Entity<undefined> {
  @IsNumber()
  private userId: number;

  @IsOptional()
  @IsArray()
  private fileExtensions: string[];

  @IsOptional()
  @IsArray()
  private signedUrls: SignedUrlValueObject[];

  constructor(params: SignedUrlNewParams) {
    super();

    this.userId = params.userId;
    this.fileExtensions = params.fileExtensionss || [];
    this.signedUrls = params.signedUrls || [];
  }

  public getUserId(): number {
    return this.userId;
  }

  public getFileExtensions(): string[] {
    return this.fileExtensions;
  }

  public getSignedUrls(): SignedUrlValueObject[] {
    return this.signedUrls;
  }

  public static async new(params: SignedUrlNewParams): Promise<SignedUrlEntity> {
    const entity: SignedUrlEntity = new SignedUrlEntity(params);

    await entity.validate();

    return entity;
  }

  public async genKeys(): Promise<string[]> {
    const filePath = DateTime.fromJSDate(new Date()).toFormat("yyyy/MM/dd");

    if (typeof this.fileExtensions === "undefined" || this.fileExtensions.length <= 0) {
      return [`/temp/usrs/${this.userId}/files/${filePath}/${v4()}`];
    }

    return this.fileExtensions.map(
      (extension) => `/temp/usrs/${this.userId}/files/${filePath}/${v4()}.${extension}`,
    );
  }

  public buildSignedUrls(signedUrls: SignedUrlValueObject[]): SignedUrlEntity {
    this.signedUrls = signedUrls;
    return this;
  }
}

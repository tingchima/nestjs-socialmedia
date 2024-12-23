import { Exclude, Expose, plainToClass } from "class-transformer";

import { SignedUrlEntity } from "@core/domain/media/entity/signed-url.entity";

type SignedUrlDto = {
  key: string;
  url: string;
};

@Exclude()
export class SignedUrlUseCaseDto {
  @Expose()
  public userId: number;

  public signedUrls: SignedUrlDto[];

  public static newFromSignedUrl(entity: SignedUrlEntity): SignedUrlUseCaseDto {
    const dto: SignedUrlUseCaseDto = plainToClass(SignedUrlUseCaseDto, entity);

    dto.signedUrls = entity.getSignedUrls().map((item) => ({
      key: item.key,
      url: item.url,
    }));

    return dto;
  }
}

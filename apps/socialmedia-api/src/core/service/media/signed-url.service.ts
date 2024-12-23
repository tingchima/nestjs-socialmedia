import { Inject, Injectable } from "@nestjs/common";

import { SignedUrlUseCase } from "@core/domain/media/interface/signed-url.use-case";
import { SignedUrlUseCaseDto } from "@core/domain/media/dto/signed-url.use-case.dto";
import { SignedUrlCreatePort } from "@core/domain/media/interface/media.user-case.port";
import { MediaInjectTokens } from "@core/domain/media/media.inject.tokens";
import { MediaFileStoragePort } from "@core/domain/media/interface/signed-url.repository.port";
import { ConfigServicePort } from "@repo/nestjs-libs";
import { SignedUrlValueObject } from "@core/domain/media/vo/signed.url.vo";
import { SignedUrlEntity } from "@core/domain/media/entity/signed-url.entity";

@Injectable()
export class SignedUrlSrvice implements SignedUrlUseCase {
  constructor(
    @Inject(MediaInjectTokens.MEDIA_FILE_STORAGE)
    private readonly mediaFileStorage: MediaFileStoragePort,

    private readonly configService: ConfigServicePort,
  ) {}

  public async createSignedUrl(params: SignedUrlCreatePort): Promise<SignedUrlUseCaseDto> {
    const entity: SignedUrlEntity = await SignedUrlEntity.new({
      userId: params.userId,
      fileExtensionss: params.fileExtensions,
    });

    const keys: string[] = await entity.genKeys();

    const signedKeys: SignedUrlValueObject[] = await Promise.all(
      keys.map(async (key) =>
        SignedUrlValueObject.new({
          key,
          url: await this.mediaFileStorage.getSignedUrl({
            key,
            bucket: this.configService.BUCKET.NAME,
            expiresIn: this.configService.BUCKET.PRESINGED_EXPIRES_IN_SEC,
          }),
        }),
      ),
    );
    entity.buildSignedUrls(signedKeys);

    return SignedUrlUseCaseDto.newFromSignedUrl(entity);
  }
}

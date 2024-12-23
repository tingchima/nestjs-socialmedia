import { SignedUrlController } from "@application/api-route/http/v1/controller/signed-url.controller";
import { MediaInjectTokens } from "@core/domain/media/media.inject.tokens";
import { SignedUrlSrvice } from "@core/service/media/signed-url.service";
import { AwsS3MediaFileStorageAdapter } from "@infrastructure/adapter/persistence/aws-s3/repository/aws-s3.media.file.storage.adapter";
import { Module, Provider } from "@nestjs/common";
import { ConfigModule } from "@repo/nestjs-libs";

const presistenceProviders: Provider[] = [
  {
    provide: MediaInjectTokens.MEDIA_FILE_STORAGE,
    useClass: AwsS3MediaFileStorageAdapter,
  },
];

const useCaseProviders: Provider[] = [
  {
    provide: MediaInjectTokens.SIGNED_URL_USE_CASE,
    useClass: SignedUrlSrvice,
  },
];

@Module({
  imports: [ConfigModule],
  controllers: [SignedUrlController],
  providers: [...presistenceProviders, ...useCaseProviders],
})
export class MediaModule {}

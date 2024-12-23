import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { MediaFileStoragePort } from "@core/domain/media/interface/signed-url.repository.port";
import { Inject, Injectable } from "@nestjs/common";
import { AppException, AwsS3InjectTokens, InternalServerError } from "@repo/nestjs-libs";

@Injectable()
export class AwsS3MediaFileStorageAdapter implements MediaFileStoragePort {
  constructor(@Inject(AwsS3InjectTokens.AWS_S3_CLIENT) private readonly client: S3Client) {}

  public async getSignedUrl(by: {
    key: string;
    bucket: string;
    expiresIn: number;
  }): Promise<string> {
    try {
      const command: PutObjectCommand = new PutObjectCommand({
        Bucket: by.bucket,
        Key: by.key,
      });

      const signedUrl = await getSignedUrl(this.client, command, {
        expiresIn: by.expiresIn,
      });

      return signedUrl;
    } catch (err: any) {
      throw AppException.new({ code: InternalServerError, cause: err });
    }
  }
}

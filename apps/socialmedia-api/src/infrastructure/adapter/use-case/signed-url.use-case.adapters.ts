import { Exclude, Expose, plainToClass } from "class-transformer";
import { IsArray, IsNumber, IsOptional } from "class-validator";

import { UseCaseValidatorAdapter } from "@repo/nestjs-libs";
import { SignedUrlCreatePort } from "@core/domain/media/interface/media.user-case.port";

@Exclude()
export class SignedUrlCreateAdapter extends UseCaseValidatorAdapter implements SignedUrlCreatePort {
  @Expose()
  @IsNumber()
  public userId: number;

  @Expose()
  @IsOptional()
  @IsArray()
  public fileExtensions?: string[];

  public static async new(params: SignedUrlCreatePort): Promise<SignedUrlCreateAdapter> {
    const adapter: SignedUrlCreateAdapter = plainToClass(SignedUrlCreateAdapter, params);

    await adapter.validate();

    return adapter;
  }
}

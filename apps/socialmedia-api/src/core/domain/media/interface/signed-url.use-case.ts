import { SignedUrlUseCaseDto } from "@core/domain/media/dto/signed-url.use-case.dto";
import { SignedUrlCreatePort } from "@core/domain/media/interface/media.user-case.port";

export interface SignedUrlUseCase {
  createSignedUrl(params: SignedUrlCreatePort): Promise<SignedUrlUseCaseDto>;
}

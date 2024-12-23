import { Body, Controller, Inject, Post } from "@nestjs/common";

import { routesV1 } from "@application/api-route/routes";
import { BearerTokenRequired } from "@application/api-route/http/bearer.token.required";
import { MediaInjectTokens } from "@core/domain/media/media.inject.tokens";
import { SignedUrlUseCase } from "@core/domain/media/interface/signed-url.use-case";
import { SignedUrlUseCaseDto } from "@core/domain/media/dto/signed-url.use-case.dto";
import { CurrentUser } from "@application/api-route/http/parameter/current.user";
import { SignedUrlCreateAdapter } from "@infrastructure/adapter/use-case/signed-url.use-case.adapters";
import { SignedUrlCreateBodySchema } from "@application/api-route/http/v1/schema/signed-url.schemas";
import { SignedUser } from "@application/api-route/authorization/types";

@Controller(routesV1.name)
export class SignedUrlController {
  constructor(
    @Inject(MediaInjectTokens.SIGNED_URL_USE_CASE)
    private readonly signedUrlUseCase: SignedUrlUseCase,
  ) {}

  @Post(routesV1.signedUrl.create)
  @BearerTokenRequired()
  public async createSignedUrl(
    @CurrentUser() currentUser: SignedUser,
    @Body() body: SignedUrlCreateBodySchema,
  ): Promise<SignedUrlUseCaseDto> {
    const adapter: SignedUrlCreateAdapter = await SignedUrlCreateAdapter.new({
      userId: currentUser.userId,
      fileExtensions: body.fileExtensions,
    });

    return await this.signedUrlUseCase.createSignedUrl(adapter);
  }
}

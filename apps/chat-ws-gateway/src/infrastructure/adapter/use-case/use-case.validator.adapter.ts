import {
  AppException,
  ClassValidationDetails,
  ClassValidator,
  Optional,
  ParameterInvalid,
} from "@repo/nestjs-libs";

export class UseCaseValidatorAdapter {
  public async validate(): Promise<void> {
    const details: Optional<ClassValidationDetails> = await ClassValidator.validate(this);
    if (details) {
      throw AppException.new({ code: ParameterInvalid, metadata: details });
    }
  }
}

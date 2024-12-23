import { ClassValidationDetails, ClassValidator } from "../../../core/entity";
import { Optional } from "../../../core/type";
import { AppException, ParameterInvalid } from "../../../exception";

export class UseCaseValidatorAdapter {
  public async validate(): Promise<void> {
    const details: Optional<ClassValidationDetails> =
      await ClassValidator.validate(this);
    if (details) {
      throw AppException.new({ code: ParameterInvalid, metadata: details });
    }
  }
}

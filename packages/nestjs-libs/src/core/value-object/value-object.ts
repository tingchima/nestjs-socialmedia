import { AppException, ParameterInvalid } from "../../exception";
import { ClassValidationDetails, ClassValidator } from "../entity";
import { Optional } from "../type";

export class ValueObject {
  public async validate(): Promise<void> {
    const details: Optional<ClassValidationDetails> =
      await ClassValidator.validate(this);
    if (details) {
      throw AppException.new({ code: ParameterInvalid, metadata: details });
    }
  }
}

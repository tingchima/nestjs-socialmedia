import { ClassValidationDetails, ClassValidator } from "./class.validitor";

import { Optional } from "../type";
import { EntityPort, IdentifierPort } from "./entity.port";
import { AppException, ParameterInvalid } from "../../exception";

export class Entity<Id extends IdentifierPort> extends EntityPort {
  protected id: Optional<Id>;

  constructor() {
    super();
  }

  public getId(): Id {
    if (typeof this.id === "undefined") {
      throw AppException.new({
        code: ParameterInvalid,
        clientMessage: `${this.constructor.name}: ID is empty.`,
      });
    }

    return this.id;
  }

  public setId(id: Id) {
    this.id = id;
  }

  public async validate(): Promise<void> {
    const details: Optional<ClassValidationDetails> = await ClassValidator.validate(this);

    if (details) {
      throw AppException.new({
        code: ParameterInvalid,
        metadata: details,
      });
    }
  }
}

import { validate, ValidationError } from "class-validator";

import { Optional } from "../type";

/**
 * Class validation errors
 */
export type ClassValidationErrors = {
  property: string;
  message: string[];
};

/**
 * Class validation details
 */
export type ClassValidationDetails = {
  context: string;
  errors: ClassValidationErrors[];
};

/**
 * Class validator
 * implement by class-validator library
 */
export class ClassValidator {
  /**
   * validate class method
   * @param target
   * @param context
   * @returns Promise<Optional<ClassValidationDetails>>
   */
  public static async validate<Target extends object>(
    target: Target,
    context?: string,
  ): Promise<Optional<ClassValidationDetails>> {
    let details: Optional<ClassValidationDetails>;
    const errors: ValidationError[] = await validate(target);

    if (errors.length > 0) {
      details = {
        context: context || target.constructor.name,
        errors: [],
      };
      for (const error of errors) {
        details.errors.push({
          property: error.property,
          message: error.constraints ? Object.values(error.constraints) : [],
        });
      }
    }

    return details;
  }
}

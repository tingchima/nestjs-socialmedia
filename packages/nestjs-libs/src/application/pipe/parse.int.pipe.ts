import { ArgumentMetadata, Injectable, PipeTransform } from "@nestjs/common";

import { AppException, ParameterInvalid } from "../../exception";

@Injectable()
export class ParseIntPipe implements PipeTransform<string, number> {
  transform(value: string, metadata: ArgumentMetadata): number {
    const val = parseInt(value, 10);
    if (isNaN(val)) {
      throw AppException.new({ code: ParameterInvalid });
    }
    return val;
  }
}

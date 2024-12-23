import { ApiProperty } from "@nestjs/swagger";

export class SignedUrlCreateBodySchema {
  @ApiProperty({ type: "number" })
  public userId: number;

  @ApiProperty({ type: "array" })
  public fileExtensions: string[];
}

import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsEnum } from "class-validator";

/** example */
export class GetCrudItemDTO {
  @IsString()
  @ApiProperty({ type: String, required: true })
  id: string;
}

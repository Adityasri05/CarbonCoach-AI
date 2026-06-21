import { IsString } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class RefreshDto {
  @ApiProperty({ description: "The JWT refresh token" })
  @IsString()
  refreshToken!: string;
}

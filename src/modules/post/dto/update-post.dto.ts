import { IsString, IsOptional, MinLength } from "class-validator";

export class UpdatePostDTO {
  @IsOptional()
  @IsString()
  @MinLength(4)
  title?: string;

  @IsOptional()
  @IsString()
  caption?: string;
}

import { IsString, IsNotEmpty, MinLength } from "class-validator";

export class PostDTO {
  @IsNotEmpty()
  @IsString()
  @MinLength(4)
  title: string;

  @IsNotEmpty()
  @IsString()
  caption: string;
}

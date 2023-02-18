import { IsString, IsNotEmpty } from "class-validator";

export class AuthDTO {
  @IsNotEmpty()
  @IsString()
  username: string;

  @IsNotEmpty()
  @IsString()
  password: string;
}

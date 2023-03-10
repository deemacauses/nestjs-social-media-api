import {
  Matches,
  IsEmail,
  IsString,
  IsNotEmpty,
  IsAlphanumeric,
} from "class-validator";

export class UserDTO {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsAlphanumeric()
  username: string;

  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/, {
    message:
      "Password Error: Your password must contain at least 8 characters, including of uppercase and lowercase letters, numbers, and special characters. Please try again.",
  })
  password: string;
}

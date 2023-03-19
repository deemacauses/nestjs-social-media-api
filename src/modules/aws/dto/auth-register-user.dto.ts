import { IsEmail, IsString, Matches } from "class-validator";

export class AuthRegisterUserDTO {
  @IsString()
  name: string;

  @IsEmail()
  email: string;

  @Matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$&+,:;=?@#|'<>.^*()%!-])[A-Za-z\d@$&+,:;=?@#|'<>.^*()%!-]{8,}$/,
    { message: "invalid password" },
  )
  password: string;
}

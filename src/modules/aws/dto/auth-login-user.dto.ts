import { IsString, Matches } from "class-validator";

export class AuthLoginUserDTO {
  @IsString()
  username: string;

  @Matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$&+,:;=?@#|'<>.^*()%!-])[A-Za-z\d@$&+,:;=?@#|'<>.^*()%!-]{8,}$/,
    { message: "invalid password" },
  )
  password: string;
}

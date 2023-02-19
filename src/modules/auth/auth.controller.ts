import { Controller, UseGuards, Body, Post } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";

import { Public } from "./../../common/decorators";
import { UserDTO } from "./../user/dto/user.dto";
import { AuthService } from "./auth.service";
import { AuthDTO } from "./dto/auth.dto";

@Controller("auth")
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @UseGuards(AuthGuard("local"))
  @Post("login")
  async login(@Body() user: AuthDTO) {
    return await this.authService.login(user);
  }

  @Public()
  @Post("signup")
  async signUp(@Body() user: UserDTO) {
    return await this.authService.signup(user);
  }
}

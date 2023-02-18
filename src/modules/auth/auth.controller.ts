import { Controller, UseGuards, Body, Post } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";

import { UserDTO } from "./../user/dto/user.dto";
import { AuthService } from "./auth.service";
import { AuthDTO } from "./dto/auth.dto";

@Controller("auth")
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(AuthGuard("local"))
  @Post("login")
  async login(@Body() user: AuthDTO) {
    return await this.authService.login(user);
  }

  @Post("signup")
  async signUp(@Body() user: UserDTO) {
    return await this.authService.signup(user);
  }
}

import { Controller, UseGuards, Body, Post, Request } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";

import { UserDTO } from "./../user/dto/user.dto";
import { AuthService } from "./auth.service";

@Controller("auth")
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(AuthGuard("local"))
  @Post("login")
  async login(@Request() request) {
    return await this.authService.login(request.user);
  }

  @Post("signup")
  async signUp(@Body() user: UserDTO) {
    return await this.authService.signup(user);
  }
}

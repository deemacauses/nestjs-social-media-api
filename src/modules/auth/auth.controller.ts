import {
  Controller,
  UseGuards,
  Body,
  Post,
  UseInterceptors,
} from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { Transaction } from "sequelize";

import { TransactionInterceptor } from "./../../common/interceptor/transaction.interceptor";
import { Public, TransactionParam } from "./../../common/decorators";
import { UserDTO } from "./../user/dto/user.dto";
import { AuthService } from "./auth.service";
import { AuthDTO } from "./dto/auth.dto";

@Controller("auth")
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @UseGuards(AuthGuard("local"))
  @UseInterceptors(TransactionInterceptor)
  @Post("login")
  async login(
    @Body() user: AuthDTO,
    @TransactionParam() transaction: Transaction,
  ) {
    return await this.authService.login(user, transaction);
  }

  @Public()
  @Post("signup")
  async signUp(@Body() user: UserDTO) {
    return await this.authService.signup(user);
  }
}

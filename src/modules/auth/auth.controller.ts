import {
  Controller,
  Body,
  Post,
  UseInterceptors,
  BadRequestException,
} from "@nestjs/common";
import { Transaction } from "sequelize";

import { TransactionInterceptor } from "./../../common/interceptor/transaction.interceptor";
import { Public, TransactionParam } from "./../../common/decorators";
import { UserDTO } from "./../user/dto/user.dto";
import { AuthService } from "./auth.service";
import { AuthDTO } from "./dto/auth.dto";
import { AWSCognitoService } from "./../aws/aws-cognito.service";

@Controller("auth")
export class AuthController {
  constructor(
    private authService: AuthService,
    private awsCognitoService: AWSCognitoService,
  ) {}

  @Public()
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

  @Public()
  @Post("confirm")
  async confirm(
    @Body() confirmUser: { username: string; confirmationCode: string },
  ) {
    try {
      return await this.awsCognitoService.confirmUser(confirmUser);
    } catch (e) {
      throw new BadRequestException(e.message);
    }
  }
}

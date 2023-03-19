/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  Injectable,
  HttpException,
  HttpStatus,
  InternalServerErrorException,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from "bcrypt";
import { Transaction } from "sequelize";

import { AuthDTO } from "./dto/auth.dto";
import { UserDTO } from "./../user/dto/user.dto";
import { UserService } from "./../user/user.service";
import { User as UserModel } from "./../user/model/user.model";
import { AWSCognitoService } from "../aws/aws-cognito.service";
import { AuthLoginUserDTO, AuthRegisterUserDTO } from "./../aws/dto";

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly awsCognitoService: AWSCognitoService,
  ) {}

  async validateUser(username: string, password: string): Promise<any | null> {
    // Use AwsCognitoService to validate the user
    const authLoginUserDto: AuthLoginUserDTO = { username, password };
    try {
      const result = await this.awsCognitoService.authenticateUser(
        authLoginUserDto,
      );
      const user = await this.userService.findUserByUsername(username);
      const { password, ...userData } = user.get({ plain: true });
      return userData;
    } catch (error) {
      return null;
    }
  }

  public async login(authDto: AuthDTO, transaction: Transaction): Promise<any> {
    // Use AwsCognitoService to authenticate the user
    const authLoginUserDto: AuthLoginUserDTO = {
      username: authDto.username,
      password: authDto.password,
    };
    try {
      const result = await this.awsCognitoService.authenticateUser(
        authLoginUserDto,
      );
      const user = await this.userService.findUserByUsername(authDto.username, {
        transaction,
      });
      const { password, ...userData } = user.get({ plain: true });
      return userData;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  public async signup(user: UserDTO): Promise<any> {
    // Use AwsCognitoService to register the user
    const authRegisterUserDto: AuthRegisterUserDTO = {
      name: user.name,
      email: user.email,
      password: user.password,
    };
    try {
      await this.awsCognitoService.registerUser(authRegisterUserDto);
      const pass = await this.hashPassword(user.password);
      const newUser = await this.userService.createUser({
        ...user,
        password: pass,
      });
      console.log(newUser);
      const token = await this.generateToken(newUser);
      return { newUser, token };
    } catch (error) {
      console.log(error);
      if (
        error.code === "UsernameExistsException" ||
        error.code === "InvalidParameterException"
      ) {
        throw new HttpException(
          { statusCode: HttpStatus.CONFLICT, message: "User already exists" },
          HttpStatus.CONFLICT,
        );
      } else {
        throw new InternalServerErrorException(error);
      }
    }
  }

  private async generateToken(user: UserModel): Promise<string> {
    const token = await this.jwtService.signAsync(user);
    return token;
  }

  private async hashPassword(password: string): Promise<string> {
    const hash = await bcrypt.hash(password, 8);
    return hash;
  }

  private async comparePassword(
    enteredPassword: string,
    databasePassword: string,
  ): Promise<boolean> {
    if (!enteredPassword || !databasePassword) {
      return false;
    }
    const match = await bcrypt.compare(enteredPassword, databasePassword);
    return match;
  }
}

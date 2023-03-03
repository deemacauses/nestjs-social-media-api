/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  Injectable,
  HttpException,
  HttpStatus,
  InternalServerErrorException,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from "bcrypt";

import { AuthDTO } from "./dto/auth.dto";
import { UserDTO } from "./../user/dto/user.dto";
import { UserService } from "./../user/user.service";
import { User as UserModel } from "./../user/model/user.model";

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(username: string, pass: string): Promise<any | null> {
    // Find if user exist with this username
    const user = await this.userService.findUserByUsername(username);
    if (!user) {
      return null;
    }
    // Find if user password match
    const match = await this.comparePassword(pass, user.password);
    if (!match) {
      return null;
    }

    const { password, ...result } = user.get({ plain: true });
    return result;
  }

  public async login(authDto: AuthDTO): Promise<any> {
    try {
      const username = authDto.username;
      const user = await this.userService.findUserByUsername(username);
      const { password, ...result } = user.get({ plain: true });
      const token = await this.generateToken(result);
      return {
        result,
        token,
      };
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  public async signup(user: UserDTO): Promise<any> {
    try {
      // Check if there exist user with the same email or username
      const email = user.email;
      const username = user.username;

      const userByEmail = await this.userService.findUserByEmail(email);
      if (userByEmail) {
        throw new HttpException(
          {
            statusCode: HttpStatus.CONFLICT,
            message: "User already exists",
          },
          HttpStatus.CONFLICT,
        );
      }

      const userByUsername = await this.userService.findUserByUsername(
        username,
      );
      if (userByUsername) {
        throw new HttpException(
          {
            statusCode: HttpStatus.CONFLICT,
            message: "User already exists",
          },
          HttpStatus.CONFLICT,
        );
      }

      // Hash the password
      const pass = await this.hashPassword(user.password);
      // Create the user
      const newUser = await this.userService.createUser({
        ...user,
        password: pass,
      });
      // Generate token
      const token = await this.generateToken(newUser);
      // Return the user and the token
      return {
        newUser,
        token,
      };
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  private async generateToken(user: UserModel): Promise<string> {
    const token = await this.jwtService.signAsync(user);
    return token;
  }

  private async hashPassword(password: string): Promise<string> {
    const hash = await bcrypt.hash(password, 10);
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

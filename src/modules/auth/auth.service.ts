/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  Injectable,
  HttpException,
  HttpStatus,
  InternalServerErrorException,
  BadRequestException,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from "bcrypt";

import { AuthDTO } from "./dto/auth.dto";
import { UserDTO } from "./../user/dto/user.dto";
import { UserService } from "./../user/user.service";
import { User } from "./../../common/types";

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(username: string, pass: string) {
    // Find if user exist with this username
    const user = await this.userService.findOneByUsername(username);
    if (!user) {
      return null;
    }
    // Find if user password match
    const match = await this.comparePassword(pass, user.password);
    if (!match) {
      return null;
    }
    const { password, ...result } = user["dataValues"];
    return result;
  }

  public async login(authDto: AuthDTO): Promise<User> {
    try {
      const username = authDto.username;
      const user = await this.userService.findOneByUsername(username);
      const { password, ...result } = user["dataValues"];
      const token = await this.generateToken(result);
      return {
        user: {
          id: user.id,
          role: user.role,
          name: user.name,
          email: user.email,
          username: user.username,
        },
        token,
      };
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  public async signup(user: UserDTO): Promise<User> {
    try {
      // Check if there exist user with the same email
      const email = user.email;
      const userExists = await this.userService.findOneByEmail(email);

      if (userExists) {
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
      const newUser = await this.userService.create({
        ...user,
        password: pass,
      });
      const { password, ...result } = newUser["dataValues"];
      // Generate token
      const token = await this.generateToken(result);
      // Return the user and the token
      return {
        user: {
          id: result.id,
          role: result.role,
          name: result.name,
          email: result.email,
          username: result.username,
        },
        token,
      };
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  private async generateToken(user) {
    const token = await this.jwtService.signAsync(user);
    return token;
  }

  private async hashPassword(password: string) {
    const hash = await bcrypt.hash(password, 10);
    return hash;
  }

  private async comparePassword(
    enteredPassword: string,
    databasePassword: string,
  ) {
    const match = await bcrypt.compare(enteredPassword, databasePassword);
    return match;
  }
}

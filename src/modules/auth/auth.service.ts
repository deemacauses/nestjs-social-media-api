import {
  Injectable,
  HttpException,
  HttpStatus,
  InternalServerErrorException,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from "bcrypt";

import { UserDTO } from "./../user/dto/user.dto";
import { UserService } from "./../user/user.service";

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(username: string, pass: string) {
    // Find if user exist with this email
    const user = await this.userService.findOneByEmail(username);
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

  public async login(user) {
    try {
      const token = await this.generateToken(user);
      return { user, token };
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  public async signup(user: UserDTO) {
    try {
      // Check if there exist user with the same email
      const email = user.email;
      const userExists = await this.userService.findOneByEmail(email);

      if (userExists) {
        throw new HttpException(
          {
            statusCode: HttpStatus.CONFLICT,
            message: "User already exist",
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
      return { user: result, token };
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

  private async comparePassword(enteredPassword, databasePassword) {
    const match = await bcrypt.compare(enteredPassword, databasePassword);
    return match;
  }
}

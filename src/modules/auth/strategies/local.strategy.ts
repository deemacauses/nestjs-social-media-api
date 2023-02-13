/**
 * Local Passport Strategy: This strategy will be used for logging in users.
 *  It will verify if the email/username and password provided by the user
 *  is valid or not. If user credentials are valid, it will return a token
 *  and user object, if not, it will throw an exception.
 */

import { Strategy } from "passport-local";
import { PassportStrategy } from "@nestjs/passport";
import { Injectable, UnauthorizedException } from "@nestjs/common";

import { AuthService } from "./../auth.service";

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
    super();
  }

  async validate(username: string, password: string): Promise<any> {
    const user = await this.authService.validateUser(username, password);
    if (!user) {
      throw new UnauthorizedException("Invalid user credentials");
    }
    return user;
  }
}

/**
 * JWT Passport Strategy: This strategy will be used to protect protected resources.
 *  Only authenticated users with a valid token will be able to access these
 *  resources or endpoints.
 */

import { ExtractJwt, Strategy } from "passport-jwt";
import { PassportStrategy } from "@nestjs/passport";
import { Injectable, UnauthorizedException } from "@nestjs/common";
import * as dotenv from "dotenv";

import { UserService } from "./../../user/user.service";

dotenv.config();

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly userService: UserService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_KEY,
    });
  }

  async validate(payload: any) {
    // Check if user in the token actually exist
    const user = await this.userService.findUserById(payload.id);
    if (!user) {
      throw new UnauthorizedException(
        "You are not authorized to perform the operation",
      );
    }
    return payload;
  }
}

import { Module } from "@nestjs/common";
import { PassportModule } from "@nestjs/passport";
import { JwtModule } from "@nestjs/jwt";
import * as dotenv from "dotenv";

import { AuthService } from "./auth.service";
import { UserModule } from "./../user/user.module";
import { AuthController } from "./auth.controller";

import { JwtStrategy } from "./strategies/jwt.strategy";
import { LocalStrategy } from "./strategies/local.strategy";
import { DatabaseModule } from "../database/database.module";

dotenv.config();

@Module({
  imports: [
    DatabaseModule,
    PassportModule,
    UserModule,
    JwtModule.register({
      secret: process.env.JWT_KEY,
      signOptions: { expiresIn: process.env.TOKEN_EXPIRATION },
    }),
  ],
  providers: [AuthService, LocalStrategy, JwtStrategy],
  controllers: [AuthController],
})
export class AuthModule {}

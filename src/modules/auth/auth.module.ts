import { Module } from "@nestjs/common";
import { PassportModule } from "@nestjs/passport";
import { JwtModule } from "@nestjs/jwt";
import * as dotenv from "dotenv";

import { AuthService } from "./auth.service";
import { UserModule } from "./../user/user.module";
import { AuthController } from "./auth.controller";

import { DatabaseModule } from "../database/database.module";
import { AWSModule } from "./../aws/aws.module";

dotenv.config();

@Module({
  imports: [
    AWSModule,
    DatabaseModule,
    PassportModule,
    UserModule,
    JwtModule.register({
      secret: process.env.JWT_KEY,
      signOptions: { expiresIn: process.env.TOKEN_EXPIRATION },
    }),
  ],
  providers: [AuthService],
  controllers: [AuthController],
})
export class AuthModule {}

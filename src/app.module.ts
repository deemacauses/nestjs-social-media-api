import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";

import { DatabaseModule } from "./database/database.module";
import { UserModule } from "./modules/user/user.module";
import { AuthModule } from "./modules/auth/auth.module";
import { PostModule } from "./modules/post/post.module";
import { CommentModule } from "./modules/comment/comment.module";

import config from "../config/config.development";

@Module({
  imports: [
    DatabaseModule,
    ConfigModule.forRoot({ load: [config], isGlobal: true }),
    UserModule,
    UserModule,
    AuthModule,
    PostModule,
    CommentModule,
  ],
})
export class AppModule {}

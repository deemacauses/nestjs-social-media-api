import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";

import { DatabaseModule } from "./modules/database/database.module";
import { UserModule } from "./modules/user/user.module";
import { AuthModule } from "./modules/auth/auth.module";
import { PostModule } from "./modules/post/post.module";
import { CommentModule } from "./modules/comment/comment.module";
import { FriendshipRequestModule } from "./modules/friendship-request/friendship-request.module";
import { FriendModule } from "./modules/friend/friend.module";

import config from "config";

@Module({
  imports: [
    DatabaseModule,
    ConfigModule.forRoot({ load: [config], isGlobal: true }),
    UserModule,
    AuthModule,
    PostModule,
    CommentModule,
    FriendshipRequestModule,
    FriendModule,
  ],
})
export class AppModule {}

import { Module } from "@nestjs/common";

import { CommentModule } from "./../comment/comment.module";
import { PostService } from "./post.service";
import { PostController } from "./post.controller";
import { postProvider } from "./post.provider";

@Module({
  imports: [CommentModule],
  providers: [PostService, ...postProvider],
  controllers: [PostController],
  exports: [PostService],
})
export class PostModule {}

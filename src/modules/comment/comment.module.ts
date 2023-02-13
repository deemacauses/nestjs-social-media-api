import { Module } from "@nestjs/common";

import { CommentService } from "./comment.service";
import { commentProvider } from "./comment.provider";

@Module({
  providers: [CommentService, ...commentProvider],
  exports: [CommentService],
})
export class CommentModule {}

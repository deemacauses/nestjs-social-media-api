import { Injectable, Inject } from "@nestjs/common";

import { COMMENT_PROVIDER } from "./../../common/constants";
import { Comment } from "./model/comment.model";
import { CommentDTO } from "./dto/comment.dto";

@Injectable()
export class CommentService {
  constructor(
    @Inject(COMMENT_PROVIDER)
    private commentRepository: typeof Comment,
  ) {}

  async create(
    postId: number,
    userId: number,
    comment: CommentDTO,
  ): Promise<void> {
    await this.commentRepository.create<Comment>({
      ...comment,
      postId,
      userId,
      createdBy: userId,
      updatedBy: userId,
    });
  }

  // Find a comment for a post according to user id
  async findOne(postId: number, userId: number): Promise<Comment> {
    return await this.commentRepository.findOne({
      where: { postId, userId },
    });
  }

  async delete(id: number, userId: number): Promise<number> {
    return await this.commentRepository.destroy({
      where: { id, userId },
    });
  }
}

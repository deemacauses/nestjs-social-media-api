import {
  Injectable,
  Inject,
  InternalServerErrorException,
} from "@nestjs/common";

import { CommentService } from "../comment/comment.service";
import { POST_PROVIDER } from "./../../common/constants";
import { User } from "../user/model/user.model";
import { Post } from "./model/post.model";
import { PostDTO } from "./dto/post.dto";
import { CommentDTO } from "./../comment/dto/comment.dto";

@Injectable()
export class PostService {
  constructor(
    @Inject(POST_PROVIDER)
    private postRepository: typeof Post,
    private commentService: CommentService,
  ) {}

  async createPost(post: PostDTO, userId: number): Promise<Post> {
    return await this.postRepository.create<Post>({
      ...post,
      userId,
      createdBy: userId,
      updatedBy: userId,
    });
  }

  async findAll(): Promise<Post[]> {
    return await this.postRepository.findAll<Post>({
      include: [{ model: User, attributes: { exclude: ["password"] } }],
    });
  }

  async findOne(id: number): Promise<Post> {
    return await this.postRepository.findOne({
      where: { id },
      include: [{ model: User, attributes: { exclude: ["password"] } }],
    });
  }

  async update(id: number, data, userId: number) {
    const [numberOfAffectedRows, [updatedPost]] =
      await this.postRepository.update(
        { ...data },
        { where: { id, userId }, returning: true },
      );
    return { numberOfAffectedRows, updatedPost };
  }

  // Create comment for a post
  async createComment(
    postId: number,
    userId: number,
    comment: CommentDTO,
  ): Promise<CommentDTO> {
    try {
      await this.commentService.create(postId, userId, comment);
      return comment;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async delete(id: number, userId: number) {
    return await this.postRepository.destroy({ where: { id, userId } });
  }
}

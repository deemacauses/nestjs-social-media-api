import {
  Injectable,
  Inject,
  InternalServerErrorException,
  NotFoundException,
} from "@nestjs/common";

import { CommentService } from "../comment/comment.service";
import { POST_PROVIDER } from "./../../common/constants";
import { User } from "../user/model/user.model";
import { Post } from "./model/post.model";
import { CommentDTO } from "./../comment/dto/comment.dto";
import { CreatePostDTO, UpdatePostDTO } from "./dto";
@Injectable()
export class PostService {
  constructor(
    @Inject(POST_PROVIDER)
    private postRepository: typeof Post,
    private commentService: CommentService,
  ) {}

  async findUserPosts(userId: number): Promise<Post[]> {
    return this.postRepository.findAll({
      where: { userId },
    });
  }

  async createPost(post: CreatePostDTO, userId: number): Promise<Post> {
    return await this.postRepository.create<Post>({
      ...post,
      userId,
      createdBy: userId,
      updatedBy: userId,
    });
  }

  async findAllPosts(): Promise<Post[]> {
    return await this.postRepository.findAll<Post>({
      include: [{ model: User, attributes: { exclude: ["password"] } }],
    });
  }

  async findPost(id: number): Promise<Post> {
    return await this.postRepository.findOne({
      where: { id },
      include: [{ model: User, attributes: { exclude: ["password"] } }],
    });
  }

  async updatePost(
    id: number,
    data: UpdatePostDTO,
    userId: number,
  ): Promise<UpdatePostDTO> {
    // Find the post by ID and user ID
    const post = await this.postRepository.findOne({
      where: { id, userId },
    });

    if (!post) throw new NotFoundException("Post not found");
    // Update the post with the provided data
    await this.postRepository.update({ ...data }, { where: { id, userId } });
    return data;
  }

  // Create comment for a post
  async createComment(
    postId: number,
    userId: number,
    comment: CommentDTO,
  ): Promise<CommentDTO> {
    try {
      await this.commentService.createComment(postId, userId, comment);
      return comment;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async deletePost(postId: number, userId: number): Promise<number> {
    return await this.postRepository.destroy({ where: { postId, userId } });
  }
}

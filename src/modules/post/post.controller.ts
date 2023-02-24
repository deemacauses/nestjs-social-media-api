import {
  Controller,
  Get,
  Param,
  NotFoundException,
  Post,
  Body,
  Patch,
  Delete,
} from "@nestjs/common";

import { CommentDTO } from "./../comment/dto/comment.dto";
import { PostService } from "./post.service";
import { Post as PostModel } from "./model/post.model";
import { CreatePostDTO, UpdatePostDTO } from "./dto";
import { GetCurrentUser, Roles } from "./../../common/decorators";
import { ROLES } from "src/common/enum";

@Controller("posts")
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Get("users/:userId")
  async findUserPosts(@Param("userId") userId: number): Promise<PostModel[]> {
    return this.postService.findUserPosts(userId);
  }

  @Get()
  async findAllPosts(): Promise<PostModel[]> {
    // Get all posts in the database
    return await this.postService.findAllPosts();
  }

  @Get(":id")
  async findPost(@Param("id") id: number): Promise<PostModel> {
    // Find the post with this id
    const post = await this.postService.findPost(id);
    // If the post doesn't exit in the database, throw a 404 error
    if (!post) {
      throw new NotFoundException("This Post doesn't exist");
    }
    // If post exist, return the post
    return post;
  }

  @Post()
  async createPost(
    @Body() post: CreatePostDTO,
    @GetCurrentUser() user: { id: number },
  ): Promise<PostModel> {
    // Create a new post and return the newly created post
    return await this.postService.createPost(post, user.id);
  }

  @Post("/:id/comments")
  async createComment(
    @Param("id") id: number,
    @GetCurrentUser() user: { id: number },
    @Body() comment: CommentDTO,
  ): Promise<CommentDTO> {
    return await this.postService.createComment(id, user.id, comment);
  }

  @Roles(ROLES.ADMIN)
  @Patch(":id")
  async updatePost(
    @Param("id") id: number,
    @Body() post: UpdatePostDTO,
    @GetCurrentUser() user: { id: number },
  ): Promise<UpdatePostDTO> {
    // Return the updated post
    return await this.postService.updatePost(id, post, user.id);
  }

  @Roles(ROLES.ADMIN)
  @Delete(":id")
  async deletePost(
    @Param("id") id: number,
    @GetCurrentUser() user: { id: number },
  ): Promise<string> {
    // Delete the post with this id
    const deleted = await this.postService.deletePost(id, user.id);
    // If the number of row affected is zero, then the post doesn't exist in our database
    if (deleted === 0) {
      throw new NotFoundException("This Post doesn't exist");
    }
    // Return success message
    return "Successfully deleted";
  }
}

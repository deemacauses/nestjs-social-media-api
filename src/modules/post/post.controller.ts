import { CommentDTO } from "./../comment/dto/comment.dto";
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

import { PostService } from "./post.service";
import { Post as PostModel } from "./model/post.model";
import { CreatePostDTO, UpdatePostDTO } from "./dto";
import { GetCurrentUser, Roles } from "./../../common/decorators";

@Controller("posts")
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Get("users/:userId")
  async findUserPosts(@Param("userId") userId: number): Promise<PostModel[]> {
    return this.postService.findUserPosts(userId);
  }

  @Get()
  async findAll(): Promise<PostModel[]> {
    // Get all posts in the database
    return await this.postService.findAll();
  }

  @Roles("admin")
  @Get(":id")
  async findOne(@Param("id") id: number): Promise<PostModel> {
    // Find the post with this id
    const post = await this.postService.findOne(id);
    // If the post doesn't exit in the database, throw a 404 error
    if (!post) {
      throw new NotFoundException("This Post doesn't exist");
    }
    // If post exist, return the post
    return post;
  }

  @Roles("admin")
  @Post()
  async createPost(
    @Body() post: CreatePostDTO,
    @GetCurrentUser() user: { id: number },
  ): Promise<PostModel> {
    // Create a new post and return the newly created post
    return await this.postService.createPost(post, user.id);
  }

  @Roles("user")
  @Post("/:id/comments")
  async createComment(
    @Param("id") id: number,
    @GetCurrentUser() user: { id: number },
    @Body() comment: CommentDTO,
  ): Promise<CommentDTO> {
    return await this.postService.createComment(id, user.id, comment);
  }

  @Roles("admin")
  @Patch(":id")
  async update(
    @Param("id") id: number,
    @Body() post: UpdatePostDTO,
    @GetCurrentUser() user: { id: number },
  ): Promise<UpdatePostDTO> {
    // Return the updated post
    return await this.postService.update(id, post, user.id);
  }

  @Roles("admin")
  @Delete(":id")
  async remove(
    @Param("id") id: number,
    @GetCurrentUser() user: { id: number },
  ): Promise<string> {
    // Delete the post with this id
    const deleted = await this.postService.delete(id, user.id);
    // If the number of row affected is zero, then the post doesn't exist in our database
    if (deleted === 0) {
      throw new NotFoundException("This Post doesn't exist");
    }
    // Return success message
    return "Successfully deleted";
  }
}

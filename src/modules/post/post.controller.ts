import { ROLES } from "./../../common/enum/index";
import { CommentDTO } from "./../comment/dto/comment.dto";
import {
  Controller,
  Get,
  Param,
  NotFoundException,
  Post,
  Body,
  Request,
  Patch,
  Delete,
} from "@nestjs/common";

import { PostService } from "./post.service";
import { Post as PostModel } from "./model/post.model";
import { PostDTO } from "./dto/post.dto";
import { Roles } from "./../../common/decorators";

@Controller("posts")
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Get()
  async findAll() {
    // Get all posts in the database
    return await this.postService.findAll();
  }

  @Roles("admin")
  @Get(":id")
  async findOne(@Param("id") id: number): Promise<PostModel> {
    // Find the post with this id
    const post = await this.postService.findOne(id);
    // If the post doesn't exit in the db, throw a 404 error
    if (!post) {
      throw new NotFoundException("This Post doesn't exist");
    }
    // If post exist, return the post
    return post;
  }

  @Roles("admin")
  @Post()
  async createPost(
    @Body() post: PostDTO,
    @Request() request,
  ): Promise<PostModel> {
    // Create a new post and return the newly created post
    return await this.postService.createPost(post, request.user.id);
  }

  @Roles("user")
  @Post("/:id/comments")
  async createComment(
    @Param("id") id: number,
    @Request() request,
    @Body() comment: CommentDTO,
  ): Promise<CommentDTO> {
    return await this.postService.createComment(id, request.user.id, comment);
  }

  @Roles("user")
  @Patch(":id")
  async update(
    @Param("id") id: number,
    @Body() post: PostDTO,
    @Request() request,
  ): Promise<PostModel> {
    // Get the number of row affected and the updated post
    const { numberOfAffectedRows, updatedPost } = await this.postService.update(
      id,
      post,
      request.user.id,
    );
    // If the number of row affected is zero, it means the post doesn't exist in our database
    if (numberOfAffectedRows === 0) {
      throw new NotFoundException("This Post doesn't exist");
    }
    // Return the updated post
    return updatedPost;
  }

  @Roles("admin")
  @Delete(":id")
  async remove(@Param("id") id: number, @Request() request) {
    // Delete the post with this id
    const deleted = await this.postService.delete(id, request.user.id);
    // If the number of row affected is zero, then the post doesn't exist in our database
    if (deleted === 0) {
      throw new NotFoundException("This Post doesn't exist");
    }
    // Return success message
    return "Successfully deleted";
  }
}

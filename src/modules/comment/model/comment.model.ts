import {
  Model,
  PrimaryKey,
  ForeignKey,
  AutoIncrement,
  BelongsTo,
  Column,
  DataType,
  Unique,
  Table,
} from "sequelize-typescript";

import { User } from "./../../user/model/user.model";
import { Post } from "./../../post/model/post.model";

@Table({
  tableName: "comment",
  timestamps: true,
  paranoid: true,
})
export class Comment extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  id: number;

  @ForeignKey(() => User)
  @Column(DataType.INTEGER)
  userId: number;

  @BelongsTo(() => User)
  user: User;

  @ForeignKey(() => Post)
  @Column(DataType.INTEGER)
  postId: number;

  @BelongsTo(() => Post)
  post: Post;

  @Unique
  @Column(DataType.STRING)
  content: string;

  @Column(DataType.DATE)
  createdAt: Date;

  @Column(DataType.DATE)
  updatedAt: Date;

  @Column(DataType.DATE)
  deletedAt: Date;

  @Column(DataType.INTEGER)
  createdBy: number;

  @Column(DataType.INTEGER)
  updatedBy: number;

  @Column(DataType.INTEGER)
  deletedBy: number;
}

import {
  Model,
  PrimaryKey,
  ForeignKey,
  BelongsTo,
  AutoIncrement,
  Column,
  DataType,
  Unique,
  Table,
  Scopes,
  HasMany,
} from "sequelize-typescript";

import { User } from "./../../user/model/user.model";
import { Comment } from "./../../comment/model/comment.model";

@Scopes(() => ({
  withComments: {
    attributes: {
      exclude: ["deletedAt", "deletedBy"],
    },
    where: {
      deletedBy: null,
    },
    include: [
      {
        model: Comment,
        as: "comment",
      },
    ],
  },
}))
@Table({
  tableName: "post",
  timestamps: true,
  paranoid: true,
})
export class Post extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  id: number;

  @ForeignKey(() => User)
  @Column(DataType.INTEGER)
  userId: number;

  @BelongsTo(() => User)
  user: User;

  @Unique
  @Column(DataType.STRING)
  title: string;

  @Column(DataType.STRING)
  caption: string;

  @HasMany(() => Comment, "postId")
  comments: Comment[];

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

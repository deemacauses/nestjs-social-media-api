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
  DefaultScope,
} from "sequelize-typescript";

import { User } from "./../../user/model/user.model";
@DefaultScope({
  attributes: {
    exclude: ["deletedAt", "deletedBy"],
  },
})
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

  @Column(DataType.DATE)
  createdAt: Date;

  @Column(DataType.DATE)
  updatedAt: Date;

  @Column(DataType.DATE)
  deletedAt: Date;

  @Column(DataType.STRING)
  createdBy: string;

  @Column(DataType.STRING)
  updatedBy: string;

  @Column(DataType.STRING)
  deletedBy: string;
}

import {
  Model,
  Column,
  DataType,
  Table,
  ForeignKey,
} from "sequelize-typescript";

import { User } from "../../user/model/user.model";
@Table({
  tableName: "friend",
  timestamps: true,
  paranoid: true,
})
export class Friend extends Model {
  @ForeignKey(() => User)
  @Column(DataType.INTEGER)
  userId: number;

  @Column(DataType.JSON)
  friends: number[];

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

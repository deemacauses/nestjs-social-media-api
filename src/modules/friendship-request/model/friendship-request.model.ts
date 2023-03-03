import {
  Model,
  Column,
  DataType,
  Table,
  Scopes,
  ForeignKey,
} from "sequelize-typescript";

import { STATUS } from "../../../common/enum";
import { User } from "./../../user/model/user.model";

@Scopes(() => ({
  user: {
    attributes: {
      exclude: ["deletedAt", "deletedBy"],
    },
  },
}))
@Table({
  tableName: "friendship-request",
  timestamps: true,
  paranoid: true,
})
export class FriendshipRequest extends Model {
  @ForeignKey(() => User)
  @Column(DataType.INTEGER)
  userId: number; // Sender

  @ForeignKey(() => User)
  @Column(DataType.INTEGER)
  friendId: number; // Responder

  @Column(DataType.ENUM(STATUS.PENDING, STATUS.ACCEPTED, STATUS.REJECTED))
  status: STATUS;

  @Column(DataType.INTEGER)
  createdBy: number;

  @Column(DataType.INTEGER)
  updatedBy: number;

  @Column(DataType.INTEGER)
  deletedBy: number;

  @Column(DataType.DATE)
  createdAt: Date;

  @Column(DataType.DATE)
  updatedAt: Date;

  @Column(DataType.DATE)
  deletedAt: Date;
}

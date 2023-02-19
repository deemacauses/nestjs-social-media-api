import {
  Model,
  PrimaryKey,
  AutoIncrement,
  Column,
  DataType,
  Unique,
  Table,
  Scopes,
} from "sequelize-typescript";

import { ROLES } from "./../../../common/enum";

@Scopes({
  basic: {
    attributes: {
      exclude: ["deletedAt, password"],
    },
  },
})
@Table({
  tableName: "user",
  timestamps: true,
  paranoid: true,
})
export class User extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  id: number;

  @Unique
  @Column(DataType.STRING)
  email: string;

  @Unique
  @Column(DataType.STRING)
  name: string;

  @Unique
  @Column(DataType.STRING)
  username: string;

  @Column(DataType.STRING)
  password: string;

  @Column(DataType.ENUM(ROLES.ADMIN, ROLES.USER))
  role: ROLES;

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

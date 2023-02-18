import { ConfigService } from "@nestjs/config";
import { Sequelize } from "sequelize-typescript";

import { DATABASE_PROVIDER, DATABASE_CONFIG } from "../../common/constants";
import { User } from "../user/model/user.model";
import { Post } from "../post/model/post.model";
import { Comment } from "../comment/model/comment.model";

export const databaseProviders = [
  {
    provide: DATABASE_PROVIDER,
    useFactory: async (configService: ConfigService) => {
      const sequelize = new Sequelize({
        ...configService.get(DATABASE_CONFIG),
      });
      sequelize.addModels([User, Post, Comment]);
      return sequelize;
    },
    inject: [ConfigService],
  },
];

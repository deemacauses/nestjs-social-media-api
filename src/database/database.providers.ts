import { ConfigService } from "@nestjs/config";
import { Sequelize } from "sequelize-typescript";

import { DATABASE_PROVIDER, DATABASE_CONFIG } from "./../common/constants";
import { User } from "./../modules/user/model/user.model";
import { Post } from "./../modules/post/model/post.model";
import { Comment } from "./../modules/comment/model/comment.model";

export const databaseProviders = [
  {
    provide: DATABASE_PROVIDER,
    useFactory: async (configService: ConfigService) => {
      const sequelize = new Sequelize({
        ...configService.get(DATABASE_CONFIG),
      });
      sequelize.addModels([User, Post, Comment]);

      await sequelize.sync();
      return sequelize;
    },
  },
];

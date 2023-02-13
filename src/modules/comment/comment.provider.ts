import { COMMENT_PROVIDER } from "./../../common/constants/index";
import { Comment } from "./model/comment.model";

export const commentProvider = [
  {
    provide: COMMENT_PROVIDER,
    useValue: Comment,
  },
];

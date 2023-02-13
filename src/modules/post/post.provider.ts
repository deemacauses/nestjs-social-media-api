import { POST_PROVIDER } from "./../../common/constants/index";
import { Post } from "./model/post.model";

export const postProvider = [
  {
    provide: POST_PROVIDER,
    useValue: Post,
  },
];

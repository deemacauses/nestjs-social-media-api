import { USER_PROVIDER } from "./../../common/constants";
import { User } from "./model/user.model";

export const userProvider = [
  {
    provide: USER_PROVIDER,
    useValue: User,
  },
];

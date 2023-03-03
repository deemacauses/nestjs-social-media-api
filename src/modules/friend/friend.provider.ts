import { FRIEND_PROVIDER } from "../../common/constants";
import { Friend } from "./model/friend.model";

export const friendProvider = [
  {
    provide: FRIEND_PROVIDER,
    useValue: Friend,
  },
];

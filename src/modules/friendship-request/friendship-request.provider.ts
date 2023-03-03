import { FRIENDSHIP_REQUEST_PROVIDER } from "../../common/constants";
import { FriendshipRequest } from "./model/friendship-request.model";

export const friendshipRequestProvider = [
  {
    provide: FRIENDSHIP_REQUEST_PROVIDER,
    useValue: FriendshipRequest,
  },
];

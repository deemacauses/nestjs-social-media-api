import { Controller, Post, Param, Get, Patch } from "@nestjs/common";

import { GetCurrentUser } from "../../common/decorators/get-current-user.decorator";
import { FriendshipRequest } from "./model/friendship-request.model";
import { FriendshipRequestService } from "./friendship-requests.service";

@Controller("friendship-request")
export class FriendshipRequestController {
  constructor(private friendshipRequestService: FriendshipRequestService) {}

  @Post(":friendId")
  async createFriendshipRequest(
    @GetCurrentUser() user: { id: number },
    @Param("friendId") friendId: number,
  ): Promise<FriendshipRequest> {
    const userId = user.id;
    return this.friendshipRequestService.createFriendshipRequest(
      userId,
      friendId,
    );
  }

  @Get()
  async getFriendshipRequests(
    @GetCurrentUser() user: { id: number },
  ): Promise<FriendshipRequest[]> {
    return this.friendshipRequestService.getFriendshipRequests(user.id);
  }

  @Patch(":requestId/accept")
  async acceptFriendshipRequest(
    @Param("requestId") requestId: number,
    @GetCurrentUser() user: { id: number },
  ): Promise<FriendshipRequest> {
    return this.friendshipRequestService.acceptFriendshipRequest(
      requestId,
      user.id,
    );
  }
}

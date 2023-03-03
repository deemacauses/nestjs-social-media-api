import { Controller, Get, NotFoundException } from "@nestjs/common";

import { FriendService } from "./friend.service";
import { Friend } from "./model/friend.model";
import { GetCurrentUser } from "./../../common/decorators";

@Controller("friends")
export class FriendController {
  constructor(private friendService: FriendService) {}

  @Get()
  async getFriendByUserId(
    @GetCurrentUser() user: { id: number },
  ): Promise<Friend> {
    const friend = await this.friendService.getFriendByUserId(user.id);
    if (!friend) {
      throw new NotFoundException(
        `There is no friends for user ${user.id} yet!`,
      );
    }
    return friend;
  }
}

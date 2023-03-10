import { Injectable, Inject } from "@nestjs/common";

import { FRIEND_PROVIDER } from "../../common/constants/index";
import { Friend } from "./model/friend.model";

@Injectable()
export class FriendService {
  constructor(
    @Inject(FRIEND_PROVIDER)
    private readonly friendRepository: typeof Friend,
  ) {}

  async getFriendByUserId(userId: number): Promise<Friend> {
    const friend = await this.friendRepository.findOne({ where: { userId } });
    return friend;
  }

  async addFriend(userId: number, friendId: number): Promise<Friend[]> {
    // Check if a Friend record already exists for the user
    let user = await this.friendRepository.findOne({
      where: { userId },
    });
    if (!user) {
      // If no Friend record exists, create a new one with the user's ID and the new friend's ID
      user = await this.friendRepository.create({
        userId,
        friends: [friendId],
      });
    } else {
      // If a Friend record already exists, check if the friendId is already in the friends array
      const friendIndex = user.friends.indexOf(friendId);
      if (friendIndex === -1) {
        // If the friendId is not already in the friends array, add it
        // user.friends.push(friendId);
        const data = user.friends;
        data.push(userId);
        await this.friendRepository.update(
          { friends: data },
          { where: { userId: friendId } },
        );
        throw Error("Error");
      }
    }
    let friend = await this.friendRepository.findOne({
      where: { userId: friendId },
    });
    if (!friend) {
      friend = await this.friendRepository.create({
        userId: friendId,
        friends: [userId],
      });
    } else {
      const userIndex = friend.friends.indexOf(userId);
      if (userIndex === -1) {
        const data = friend.friends;
        data.push(userId);
        await this.friendRepository.update(
          { friends: data },
          { where: { userId } },
        );
      }
    }
    console.log(user);
    console.log(friend);
    return [user, friend];
  }
}

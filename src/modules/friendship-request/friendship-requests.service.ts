import { Injectable, Inject, BadRequestException } from "@nestjs/common";

import { FRIENDSHIP_REQUEST_PROVIDER } from "../../common/constants/index";
import { FriendshipRequest } from "./model/friendship-request.model";
import { STATUS } from "../../common/enum";
import { FriendService } from "../friend/friend.service";

@Injectable()
export class FriendshipRequestService {
  constructor(
    @Inject(FRIENDSHIP_REQUEST_PROVIDER)
    private readonly friendshipRequestRepository: typeof FriendshipRequest,
    private friendService: FriendService,
  ) {}

  async createFriendshipRequest(
    userId: number,
    friendId: number,
  ): Promise<FriendshipRequest> {
    if (friendId === userId) {
      throw new BadRequestException("It is not possible to add yourself!");
    }
    // Check if users are already friends
    const friends = await this.friendService.getFriendByUserId(friendId);

    if (friends && friends.friends.includes(userId)) {
      throw new BadRequestException(
        "You have already sent a request to this user before.",
      );
    }
    // Create a new friendship request with a status of "pending"
    const friendshipRequest = this.friendshipRequestRepository.create({
      userId,
      friendId,
      status: STATUS.PENDING,
    });
    return friendshipRequest;
  }

  async getFriendshipRequests(userId: number): Promise<FriendshipRequest[]> {
    const friendshipRequest = await this.friendshipRequestRepository.findAll({
      where: { friendId: userId, status: STATUS.PENDING },
    });
    return friendshipRequest;
  }

  async acceptFriendshipRequest(
    userId: number,
    friendId: number,
  ): Promise<FriendshipRequest> {
    const request = await this.friendshipRequestRepository.findOne({
      where: { userId, friendId, status: STATUS.PENDING },
    });
    if (!request) {
      throw new BadRequestException("Invalid friendship request.");
    }
    request.status = STATUS.ACCEPTED;
    await request.save();

    // Add the users to each other's friends lists
    const user = request.userId;
    const friend = request.friendId;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [userFriend, friendFriend] = await this.friendService.addFriend(
      user,
      friend,
    );
    return request;
  }
}

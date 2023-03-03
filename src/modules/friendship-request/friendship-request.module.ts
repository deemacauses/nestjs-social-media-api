import { Module } from "@nestjs/common";

import { FriendshipRequestController } from "./friendship-request.controller";
import { friendshipRequestProvider } from "./friendship-request.provider";
import { FriendshipRequestService } from "./friendship-requests.service";
import { FriendModule } from "./../friend/friend.module";

@Module({
  imports: [FriendModule],
  providers: [FriendshipRequestService, ...friendshipRequestProvider],
  controllers: [FriendshipRequestController],
  exports: [FriendshipRequestService],
})
export class FriendshipRequestModule {}

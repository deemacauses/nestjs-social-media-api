import { Module } from "@nestjs/common";

import { FriendController } from "./friend.controller";
import { friendProvider } from "./friend.provider";
import { FriendService } from "./friend.service";

@Module({
  providers: [FriendService, ...friendProvider],
  controllers: [FriendController],
  exports: [FriendService],
})
export class FriendModule {}

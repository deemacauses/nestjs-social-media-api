import { UserService } from "../../modules/user/user.service";
import { JwtService } from "@nestjs/jwt";
import { Reflector } from "@nestjs/core";
import { Injectable, CanActivate, ExecutionContext } from "@nestjs/common";

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.get<boolean>(
      "isPublic",
      context.getHandler(),
    );
    if (isPublic) {
      return true;
    }
    const request = context.switchToHttp().getRequest();
    const { authorization } = request.headers;

    if (!authorization) {
      return false;
    }

    try {
      const decodedToken = this.jwtService.verify(authorization);
      const userFromDB = await this.userService.findUserByUsername(
        decodedToken.username,
      );
      if (!userFromDB) {
        return false;
      }
      request.user = userFromDB;
      return true;
    } catch {
      return false;
    }
  }
}

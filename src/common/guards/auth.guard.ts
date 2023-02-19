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
    console.log(request.headers.authorization);
    const { authorization } = request.headers;
    console.log(authorization);

    if (!authorization) {
      return false;
    }

    try {
      const decodedToken = this.jwtService.verify(authorization);
      const userFromDB = await this.userService.findOneByUsername(
        decodedToken.username,
      );
      if (!userFromDB) {
        console.log(userFromDB);
        return false;
      }
      request.user = userFromDB;
      console.log(request.user);
      return true;
    } catch {
      return false;
    }
  }
}

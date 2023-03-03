import { Injectable, Inject } from "@nestjs/common";

import { USER_PROVIDER } from "./../../common/constants";
import { UserDTO } from "./dto/user.dto";
import { User } from "./model/user.model";
import { ROLES } from "./../../common/enum";

@Injectable()
export class UserService {
  constructor(
    @Inject(USER_PROVIDER)
    private readonly userRepository: typeof User,
  ) {}

  async createUser(user: UserDTO): Promise<User> {
    const role = ROLES.USER;
    const newUser = await this.userRepository
      .scope("user")
      .create<User>({
        ...user,
        role,
      })
      .then((user) => user.get({ plain: true }));
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...rest } = newUser;
    return rest;
  }

  async findUserByEmail(email: string) {
    const user = (await this.userRepository.findOne({
      where: { email },
    })) as User;
    return user;
  }

  async findUserByUsername(username: string) {
    const user = (await this.userRepository.findOne({
      where: { username },
    })) as User;
    return user;
  }

  async findUserById(id: number): Promise<User> {
    return await this.userRepository.findOne<User>({ where: { id } });
  }
}

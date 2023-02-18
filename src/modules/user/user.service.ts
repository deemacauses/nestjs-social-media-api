import { Injectable, Inject } from "@nestjs/common";

import { USER_PROVIDER } from "./../../common/constants";
import { UserDTO } from "./dto/user.dto";
import { User } from "./model/user.model";

@Injectable()
export class UserService {
  constructor(
    @Inject(USER_PROVIDER)
    private readonly userRepository: typeof User,
  ) {}

  async create(user: UserDTO): Promise<User> {
    return await this.userRepository.create<User>({ ...user });
  }

  async findOneByEmail(email: string): Promise<User> {
    return await this.userRepository.findOne<User>({ where: { email } });
  }

  async findOneByUsername(username: string): Promise<User> {
    return await this.userRepository.findOne<User>({ where: { username } });
  }

  async findOneById(id: number): Promise<User> {
    return await this.userRepository.findOne<User>({ where: { id } });
  }
}

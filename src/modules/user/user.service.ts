import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "./user.entity";
import { FindOneOptions, Repository } from "typeorm";
import { CreateUserDto } from "./dtos/create-user.dto";

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>
  ) {}

  async createUser(user: CreateUserDto): Promise<User> {
    try {
      const newUser = this.userRepository.create({
        email: user.email,
        password: user.password,
        role: user.role,
      });
      await this.userRepository.save(newUser);
      return newUser;
    } catch (error) {
      throw error;
    }
  }

  async findOne(filter: FindOneOptions<User>) {
    return await this.userRepository.findOne(filter);
  }

  async findAll() {
    return await this.userRepository.find();
  }

  async update(id: number, user: CreateUserDto) {
    return await this.userRepository.update(id, user);
  }

  async remove(id: number) {
    return await this.userRepository.delete(id);
  }
}

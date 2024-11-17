import { Injectable, UnauthorizedException } from '@nestjs/common';
import { CreateUserInput } from './dto/create-user.input';
import { UpdateUserInput } from './dto/update-user.input';
import { UserRepository } from './user.repository';
import * as bcrypt from 'bcrypt';
@Injectable()
export class UsersService {
  constructor(private readonly userRepository: UserRepository) { }
  async create(createUserInput: CreateUserInput) {
    return this.userRepository.create({
      ...createUserInput,
      password: await bcrypt.hash(createUserInput.password, 10)
    });
  }

  async findAll() {
    return this.userRepository.find({});
  }

  async findOne(_id: string) {
    return this.userRepository.findOne({ _id: _id });
  }

  async update(_id: string, updateUserInput: UpdateUserInput) {
    if (updateUserInput.password) {
      updateUserInput.password = await bcrypt.hash(updateUserInput.password, 10);
    }
    return this.userRepository.findOneAndUpdate({ _id: _id }, {
      $set: {
        ...updateUserInput,
      }
    });
  }

  async remove(_id: string) {
    return this.userRepository.findOneAndDelete({ _id: _id });
  }

  async verifyUser(email: string, passport: string) {
    const user = await this.userRepository.findOne({ email });
    const isValidPassword = await bcrypt.compare(passport, user.password);

    if(!isValidPassword) {
      throw new UnauthorizedException('Credentials are not valid.');
    }
    return user;
  }
}

import { Injectable, UnauthorizedException, UnprocessableEntityException } from '@nestjs/common';
import { CreateUserInput } from './dto/create-user.input';
import { UpdateUserInput } from './dto/update-user.input';
import { UsersRepository } from './users.repository';
import * as bcrypt from 'bcrypt';
@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) { }
  async create(createUserInput: CreateUserInput) {
    try {
      return await this.usersRepository.create({
        ...createUserInput,
        password: await bcrypt.hash(createUserInput.password, 10)
      });
    } catch (err) {
      if (err.messsage.includes('E11000')) {
        throw new UnprocessableEntityException('Email already exists.');
      }
      throw err;
    }
  }

  async findAll() {
    return this.usersRepository.find({});
  }

  async findOne(_id: string) {
    return this.usersRepository.findOne({ _id: _id });
  }

  async update(_id: string, updateUserInput: UpdateUserInput) {
    if (updateUserInput.password) {
      updateUserInput.password = await bcrypt.hash(updateUserInput.password, 10);
    }
    return this.usersRepository.findOneAndUpdate({ _id: _id }, {
      $set: {
        ...updateUserInput,
      }
    });
  }

  async remove(_id: string) {
    return this.usersRepository.findOneAndDelete({ _id: _id });
  }

  async verifyUser(email: string, passport: string) {
    const user = await this.usersRepository.findOne({ email });
    const isValidPassword = await bcrypt.compare(passport, user.password);

    if (!isValidPassword) {
      throw new UnauthorizedException('Credentials are not valid.');
    }
    return user;
  }
}

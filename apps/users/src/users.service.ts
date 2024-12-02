import {
  Injectable,
  UnprocessableEntityException,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersRepository } from './users.repository';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcryptjs';
import { UserDto } from 'lib/common';

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}

  async create(createUserDto: CreateUserDto) {
    await this.validateCreateUserDto(createUserDto);
    return this.usersRepository.create({
      ...createUserDto,
      password: await bcrypt.hash(createUserDto.password, 10),
    });
  }

  private async validateCreateUserDto(createUserDto: CreateUserDto) {
    let existingUser;
    try {
      existingUser = await this.usersRepository.findOne({
        email: createUserDto.email,
      });
    } catch (err) {
      return;
    }

    if (existingUser) {
      throw new UnprocessableEntityException('Email already exists.');
    }
  }

  async getUser(getUserDto: Partial<UserDto>) {
    try {
      const user = await this.usersRepository.findOne(getUserDto);
      if (!user) {
        throw new UnauthorizedException('User not found');
      }
      return user;
    } catch (err) {
      console.error('Error in getUser:', err);
      throw new UnauthorizedException('User not found');
    }
  }
}

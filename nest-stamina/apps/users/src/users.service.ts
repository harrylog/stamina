import {
  Injectable,
  UnprocessableEntityException,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersRepository } from './users.repository';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcryptjs';
import { BaseUserDto } from 'lib/common';

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

  async getUser(getUserDto: Partial<BaseUserDto>) {
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
  async verifyUser(email: string, password: string) {
    try {
      // Find user by email
      const user = await this.usersRepository.findOne({ email });

      if (!user) {
        throw new UnauthorizedException('Invalid credentials');
      }

      // Verify password
      const passwordIsValid = await bcrypt.compare(password, user.password);

      if (!passwordIsValid) {
        throw new UnauthorizedException('Invalid credentials');
      }

      // Return user without password
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password: _, ...result } = user;
      return result;
    } catch (err) {
      console.error('Error in verifyUser:', err);
      throw new UnauthorizedException('Invalid credentials');
    }
  }
}

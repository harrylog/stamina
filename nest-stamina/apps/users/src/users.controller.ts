// apps/users/src/users.controller.ts
import { Controller, Body } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { UsersService } from './users.service';
import { CreateUserDto } from 'lib/common';

@Controller()
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @MessagePattern('create_user')
  async createUser(@Body() data: CreateUserDto) {
    try {
      return await this.usersService.create(data);
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  }

  @MessagePattern('get_user')
  async getUserByEmail(data: { email: string }) {
    try {
      console.log('Getting user with email:', data.email);
      const user = await this.usersService.getUser({ email: data.email });
      console.log('Found user:', !!user);
      return user;
    } catch (error) {
      console.error('Error getting user:', error);
      throw error;
    }
  }

  @MessagePattern('get_user_by_id')
  async getUserById(data: { _id: string }) {
    return this.usersService.getUser({ _id: data._id });
  }

  @MessagePattern('verify_user')
  async verifyUser(data: { email: string; password: string }) {
    return this.usersService.verifyUser(data.email, data.password);
  }
}

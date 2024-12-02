// apps/users/src/users.controller.ts
import { Controller, Body } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';

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
}

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
    return this.usersService.create(data);
  }

  @MessagePattern('get_user')
  async getUserByEmail(data: { email: string }) {
    return this.usersService.getUser({ email: data.email });
  }
}

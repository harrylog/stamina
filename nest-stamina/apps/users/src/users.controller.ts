// users.controller.ts
import {
  Controller,
  Body,
  Post,
  Get,
  Put,
  Delete,
  Param,
  Query,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { UsersService } from './users.service';
import {
  Auth,
  CreateUserDto,
  UpdateUserDto,
  UserResponseDto,
  UserRole,
} from 'lib/common';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // Create User
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createUserHttp(
    @Body() createUserDto: CreateUserDto,
  ): Promise<UserResponseDto> {
    try {
      console.log('Creating user via HTTP:', createUserDto);
      return await this.usersService.create(createUserDto);
    } catch (error) {
      console.error('Error creating user via HTTP:', error);
      throw error;
    }
  }

  // Message queue handler for creating user
  @MessagePattern('create_user')
  async createUserMessage(
    @Payload() createUserDto: CreateUserDto,
  ): Promise<UserResponseDto> {
    try {
      console.log('Creating user via message queue:', createUserDto);
      return await this.usersService.create(createUserDto);
    } catch (error) {
      console.error('Error creating user via message queue:', error);
      throw error;
    }
  }

  @Get(':email')
  async getUserByEmailHttp(
    @Param('email') email: string,
  ): Promise<UserResponseDto> {
    try {
      return await this.usersService.getUser({ email });
    } catch (error) {
      console.error('Error getting user via HTTP:', error);
      throw error;
    }
  }

  // Message queue handler for getting user
  @MessagePattern('get_user')
  async getUserByMessage(
    @Payload() data: { _id?: string; email?: string },
  ): Promise<UserResponseDto> {
    try {
      return await this.usersService.getUser(data);
    } catch (error) {
      console.error('Error getting user via message queue:', error);
      throw error;
    }
  }

  // // Get User by ID
  // @Get(':id')
  // @MessagePattern('get_user_by_id')
  // @Auth(UserRole.USER)
  // async getUserById(@Param('id') id: string): Promise<UserResponseDto> {
  //   return this.usersService.getUser({ _id: id });
  // }

  // // Get All Users with Pagination
  // @Get()
  // @MessagePattern('get_all_users')
  // @Auth(UserRole.ADMIN, UserRole.MODERATOR)
  // async getAllUsers(@Query('page') page = 1, @Query('limit') limit = 10) {
  //   const skip = (page - 1) * limit;
  //   return this.usersService.findAll({ skip, limit: +limit });
  // }

  // // Update User
  // @Put(':id')
  // @MessagePattern('update_user')
  // @Auth(UserRole.USER)
  // async updateUser(@Param('id') id: string, @Body() updateData: UpdateUserDto) {
  //   return this.usersService.updateOne(id, updateData);
  // }

  // // Delete Single User (Admin only)
  // @Delete(':id')
  // @MessagePattern('delete_user')
  // @Auth(UserRole.ADMIN)
  // @HttpCode(HttpStatus.NO_CONTENT)
  // async deleteUser(@Param('id') id: string) {
  //   return this.usersService.deleteOne(id);
  // }

  // // Delete Multiple Users (Moderator only)
  // @Delete()
  // @MessagePattern('delete_many_users')
  // @Auth(UserRole.MODERATOR)
  // @HttpCode(HttpStatus.NO_CONTENT)
  // async deleteManyUsers(@Body() data: { ids: string[] }) {
  //   return this.usersService.deleteMany(data.ids);
  // }

  // Verify User (Login)
  @Post('verify')
  @MessagePattern('verify_user')
  async verifyUser(@Body() data: { email: string; password: string }) {
    return this.usersService.verifyUser(data.email, data.password);
  }
}

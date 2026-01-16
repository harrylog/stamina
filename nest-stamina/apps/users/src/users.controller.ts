// users.controller.ts
import {
  Controller,
  Body,
  Post,
  Get,
  Put,
  Delete,
  Param,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { UsersService } from './users.service';
import {
  Auth,
  AdminAuth,
  CreateUserDto,
  UpdateUserDto,
  UserResponseDto,
  UserRole,
} from 'lib/common';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // ==================== HTTP ENDPOINTS ====================

  // Create User - Admin only
  @Post()
  @AdminAuth()
  @HttpCode(HttpStatus.CREATED)
  async createUser(
    @Body() createUserDto: CreateUserDto,
  ): Promise<UserResponseDto> {
    return this.usersService.create(createUserDto);
  }

  // Get All Users - Admin or Moderator
  @Get()
  @Auth(UserRole.ADMIN, UserRole.MODERATOR)
  async getAllUsers() {
    return this.usersService.findAll();
  }

  // Get User by ID - Any authenticated user
  @Get(':id')
  @Auth(UserRole.ADMIN, UserRole.MODERATOR, UserRole.USER)
  async getUserById(@Param('id') id: string): Promise<UserResponseDto> {
    return this.usersService.getUser({ _id: id });
  }

  // Update User - Admin or Moderator
  @Put(':id')
  @Auth(UserRole.ADMIN, UserRole.MODERATOR)
  async updateUser(
    @Param('id') id: string,
    @Body() updateData: UpdateUserDto,
  ): Promise<UserResponseDto> {
    return this.usersService.updateOne(id, updateData);
  }

  // Delete User - Admin only
  @Delete(':id')
  @AdminAuth()
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteUser(@Param('id') id: string): Promise<UserResponseDto> {
    return this.usersService.deleteOne(id);
  }

  // Delete Multiple Users - Admin only
  @Delete()
  @AdminAuth()
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteManyUsers(@Body() data: { ids: string[] }) {
    return this.usersService.deleteMany(data.ids);
  }

  // ==================== MESSAGE QUEUE HANDLERS ====================
  // These are for internal service-to-service communication (no HTTP auth needed)

  @MessagePattern('create_user')
  async createUserMessage(
    @Payload() createUserDto: CreateUserDto,
  ): Promise<UserResponseDto> {
    return this.usersService.create(createUserDto);
  }

  @MessagePattern('get_user')
  async getUserMessage(
    @Payload() data: { _id?: string; email?: string },
  ): Promise<UserResponseDto> {
    return this.usersService.getUser(data);
  }

  @MessagePattern('get_user_by_id')
  async getUserByIdMessage(@Payload() id: string): Promise<UserResponseDto> {
    return this.usersService.getUser({ _id: id });
  }

  @MessagePattern('get_all_users')
  async getAllUsersMessage() {
    return this.usersService.findAll();
  }

  @MessagePattern('update_user')
  async updateUserMessage(
    @Payload() data: { id: string; updateData: UpdateUserDto },
  ): Promise<UserResponseDto> {
    return this.usersService.updateOne(data.id, data.updateData);
  }

  @MessagePattern('delete_user')
  async deleteUserMessage(@Payload() id: string): Promise<UserResponseDto> {
    return this.usersService.deleteOne(id);
  }

  @MessagePattern('verify_user')
  async verifyUserMessage(
    @Payload() data: { email: string; password: string },
  ) {
    return this.usersService.verifyUser(data.email, data.password);
  }
}

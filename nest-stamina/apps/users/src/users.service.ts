import {
  Injectable,
  UnprocessableEntityException,
  UnauthorizedException,
  NotFoundException,
} from '@nestjs/common';
import { UsersRepository } from './users.repository';
import * as bcrypt from 'bcryptjs';
import {
  CreateUserDto,
  GetUserDto,
  UpdateUserDto,
  UserDocument,
  UserResponseDto,
  UserRole,
} from 'lib/common';
import { Types } from 'mongoose';

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}

  async create(createUserDto: CreateUserDto): Promise<UserResponseDto> {
    await this.validateCreateUserDto(createUserDto);
    console.log(createUserDto.roles);
    const userToCreate = {
      ...createUserDto,
      password: await bcrypt.hash(createUserDto.password, 10),
      isActive: true,
      roles: createUserDto.roles || [UserRole.USER],
      lastLogin: new Date(),
    };

    const createdUser = await this.usersRepository.create(userToCreate);
    return this.toUserResponse(createdUser);
  }

  async updateOne(
    id: string,
    updateUserDto: UpdateUserDto,
  ): Promise<UserResponseDto> {
    const updateData: Partial<UserDocument> = { ...updateUserDto };

    if (updateUserDto.password) {
      updateData.password = await bcrypt.hash(updateUserDto.password, 10);
    }

    const updatedUser = await this.usersRepository.findOneAndUpdate(
      { _id: new Types.ObjectId(id) },
      updateData,
    );
    return this.toUserResponse(updatedUser);
  }

  async deleteOne(id: string): Promise<UserResponseDto> {
    const deletedUser = await this.usersRepository.findOneAndDelete({
      _id: new Types.ObjectId(id),
    });
    return this.toUserResponse(deletedUser);
  }

  async deleteMany(ids: string[]): Promise<{ deletedCount: number }> {
    const objectIds = ids.map((id) => new Types.ObjectId(id));
    return this.usersRepository.deleteMany({ _id: { $in: objectIds } });
  }

  async findAll() {
    const [users, total] = await Promise.all([
      this.usersRepository.find({}),
      this.usersRepository.count({}),
    ]);

    return {
      users: users.map((user) => this.toUserResponse(user)),
      total,
    };
  }

  async getUser(getUserDto: Partial<GetUserDto>): Promise<UserResponseDto> {
    try {
      console.log('Service received getUserDto:', getUserDto);
      console.log('Type of _id:', typeof getUserDto._id);
      console.log('Keys in getUserDto:', Object.keys(getUserDto));

      console.log('getUserDto', getUserDto);
      const user = await this.usersRepository.findOne(getUserDto);
      return this.toUserResponse(user);
    } catch (err) {
      console.error('Error in getUser:', err);
      throw new UnauthorizedException('User not found');
    }
  }

  async verifyUser(email: string, password: string) {
    try {
      const user = await this.usersRepository.findOne({ email });
      const passwordIsValid = await bcrypt.compare(password, user.password);

      if (!passwordIsValid) {
        throw new UnauthorizedException('Invalid credentials');
      }

      // Update last login
      await this.usersRepository.findOneAndUpdate(
        { _id: user._id },
        { lastLogin: new Date() },
      );

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password: _, ...result } = this.toUserResponse(user);
      return result;
    } catch (err) {
      throw new UnauthorizedException('Invalid credentials');
    }
  }

  private toUserResponse(user: UserDocument): UserResponseDto {
    return {
      _id: user._id.toString(), // Convert ObjectId to string
      email: user.email,
      password: user.password,
      roles: user.roles,
      name: user.name,
      isActive: user.isActive ?? true,
      lastLogin: user.lastLogin,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }

  private async validateCreateUserDto(createUserDto: CreateUserDto) {
    let existingUser;
    try {
      existingUser = await this.usersRepository.findOne({
        email: createUserDto.email,
      });
    } catch (err) {
      if (err instanceof NotFoundException) {
        return;
      }
      throw err;
    }

    if (existingUser) {
      throw new UnprocessableEntityException('Email already exists.');
    }
  }
}

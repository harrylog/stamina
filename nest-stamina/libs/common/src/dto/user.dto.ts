import { UserRole } from '../enums';

export interface UserDto {
  _id: string;
  email: string;
  password: string;
  roles?: string[];
}

export class CreateUserDto {
  email: string;
  password: string;
  role?: UserRole;
  name?: string;
}

export class UpdateUserDto {
  email?: string;
  password?: string;
  role?: UserRole;
  name?: string;
  isActive?: boolean;
}

export interface UserResponseDto {
  _id: string;
  password?: string;
  email: string;
  role: UserRole;
  name?: string;
  isActive: boolean;
  lastLogin?: Date;
  createdAt: Date;
  updatedAt: Date;
}

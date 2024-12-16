// export interface User {
//   id?: string;
//   email: string;
//   password: string;
//   roles?: UserRole[];
//   name?: string;
//   isActive?: boolean;
//   lastLogin?: Date;
//   createdAt?: Date;
//   _id?: string; // MongoDB typically uses _id
// }

export enum UserRole {
  ADMIN = 'ADMIN',
  USER = 'USER',
  MODERATOR = 'MODERATOR', // Optional, for future use
}

export interface BaseUser {
  email: string;
  password: string;
  roles?: UserRole[];
  name?: string;
  isActive?: boolean;
  lastLogin?: Date;
  id?: string; // For frontend use
  _id?: string; // From MongoDB
}

export interface User extends BaseUser {
  createdAt: Date;
}

export interface CreateUserDto extends BaseUser {
  roles?: UserRole[];
}

export interface UpdateUserDto {
  email?: string;
  password?: string;
  roles?: UserRole[];
  name?: string;
  isActive?: boolean;
}

export interface UserResponseDto extends Omit<User, 'password'> {
  password?: string; // Make password optional in response
}

export interface UsersResponse {
  users: UserResponseDto[];
  total: number;
}

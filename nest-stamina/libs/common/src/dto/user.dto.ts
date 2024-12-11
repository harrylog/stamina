import {
  IsArray,
  IsBoolean,
  IsDate,
  IsEmail,
  IsMongoId,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';
import { UserRole } from '../enums';

export class BaseUserDto {
  @IsMongoId()
  @IsNotEmpty()
  _id: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  password: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @IsNotEmpty({ each: true })
  roles?: UserRole[];

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  name?: string;
}

export class CreateUserDto extends BaseUserDto {}

export class UpdateUserDto {
  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  @MinLength(8)
  password?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @IsNotEmpty({ each: true })
  roles?: UserRole[];

  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}

export class GetUserDto {
  @IsMongoId()
  @IsNotEmpty()
  _id: string;
}

export class UserResponseDto {
  @IsMongoId()
  @IsNotEmpty()
  _id: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsOptional()
  @IsString()
  password?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  roles?: UserRole[];

  @IsOptional()
  @IsString()
  name?: string;

  @IsBoolean()
  isActive: boolean;

  @IsOptional()
  @IsDate()
  lastLogin?: Date;

  @IsDate()
  createdAt: Date;

  @IsDate()
  updatedAt: Date;
}

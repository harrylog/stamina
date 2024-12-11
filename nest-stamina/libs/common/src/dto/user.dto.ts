// user.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { AbstractDocument } from '../db';
import { UserRole } from '../enums';

@Schema({ versionKey: false, timestamps: true })
export class UserDocument extends AbstractDocument {
  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ type: [String], enum: UserRole, default: [UserRole.USER] })
  roles?: UserRole[];

  @Prop({ default: true })
  isActive?: boolean;

  @Prop()
  name?: string;

  @Prop()
  lastLogin?: Date;

  // timestamps: true will automatically add these
  createdAt?: Date;
  updatedAt?: Date;
}

export const UserSchema = SchemaFactory.createForClass(UserDocument);

// user.dto.ts (updated version)
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

// Base DTO with common properties
export class BaseUserDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(4)
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

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @IsOptional()
  @IsDate()
  lastLogin?: Date;
}

// DTO for creating new users
export class CreateUserDto extends BaseUserDto {}
// DTO for getting a single user by ID

export class GetUserDto extends BaseUserDto {
  @IsMongoId()
  @IsNotEmpty()
  _id: string;
}

// DTO for updating existing users
export class UpdateUserDto {
  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  @MinLength(4)
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

// Response DTO
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

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @IsOptional()
  @IsDate()
  lastLogin?: Date;

  @IsOptional()
  @IsDate()
  createdAt: Date;

  @IsOptional()
  @IsDate()
  updatedAt: Date;
}

import {
  IsArray,
  IsEmail,
  IsEnum,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';
import { UserRole } from '../enums';

export class SignUpDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(4)
  password: string;

  @IsOptional()
  @IsArray()
  @IsEnum(UserRole, { each: true })
  roles?: UserRole[];
}

export class LoginDto {
  @IsEmail()
  email: string;

  @IsString()
  password: string;

  roles?: UserRole[];
}

export class TokenPayload {
  email: string;
  roles?: UserRole[];
}

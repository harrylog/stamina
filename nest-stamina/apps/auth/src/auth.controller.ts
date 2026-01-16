// apps/auth/src/auth.controller.ts
import {
  Body,
  Controller,
  Post,
  Get,
  Res,
  // Req,
  UseGuards,
  UnauthorizedException,
  Logger,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CurrentUser, Roles, LoginDto, SignUpDto, UserRole } from 'lib/common';
import { Response } from 'express';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { IAuthenticatedUser } from './interfaces/token-payload.interface';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { Jwt2AuthGuard } from './guards/jwt2-auth.guard';
import { JwtService } from '@nestjs/jwt';
import { MessagePattern, Payload } from '@nestjs/microservices';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly jwtService: JwtService,
  ) {}
  private readonly logger = new Logger(AuthController.name);

  @Post('signup')
  async signUp(
    @Body() signUpDto: SignUpDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    try {
      console.log('Raw request body:', signUpDto);
      // Ensure roles are properly included
      const processedSignUpDto = {
        email: signUpDto.email,
        password: signUpDto.password,
        roles: signUpDto.roles || [UserRole.USER], // Explicitly include roles
      };
      console.log('Processed signup DTO:', processedSignUpDto);
      const result = await this.authService.signUp(
        processedSignUpDto,
        response,
      );
      console.log('Signup result:', result);
      return result;
    } catch (error) {
      console.error('Detailed signup error:', {
        message: error.message,
        stack: error.stack,
        name: error.name,
      });
      throw error;
    }
  }

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(
    @Body() loginDto: LoginDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    const jwt = await this.authService.login(loginDto, response);
    response.send(jwt);
  }

  @Get('me')
  @UseGuards(JwtAuthGuard, Jwt2AuthGuard)
  @Roles(UserRole.USER)
  async getMe(
    @CurrentUser() user: IAuthenticatedUser,
    // @Req() request: Request,
  ) {
    // console.log('Request user:', request.user);
    return user;
  }

  @MessagePattern('authenticate')
  async authenticate(@Payload() data: { Authentication: string }) {
    try {
      // Verify the token and decode payload (contains email, roles)
      const decoded = await this.jwtService.verifyAsync(data.Authentication);
      this.logger.log(`Token verified for: ${decoded.email}`);

      // Return the decoded payload with email and roles for RBAC
      return {
        email: decoded.email,
        roles: decoded.roles,
      };
    } catch (error) {
      this.logger.error('Token verification failed:', error.message);
      throw new UnauthorizedException('Invalid token');
    }
  }
}

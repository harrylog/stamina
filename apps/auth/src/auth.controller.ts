// apps/auth/src/auth.controller.ts
import {
  Body,
  Controller,
  Post,
  Get,
  Res,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CurrentUser, SignInDto, SignUpDto } from 'lib/common';
import { Response } from 'express';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { IAuthenticatedUser } from './interfaces/token-payload.interface';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  async signUp(
    @Body() signUpDto: SignUpDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    return this.authService.signUp(signUpDto, response);
  }

  @Post('signin')
  async signIn(
    @Body() signInDto: SignInDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    const jwt = await this.authService.signIn(signInDto, response);
    response.send(jwt);
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  async getMe(
    @CurrentUser() user: IAuthenticatedUser,
    @Req() request: Request,
  ) {
    console.log('Request user:', request.user);
    return user;
  }
}

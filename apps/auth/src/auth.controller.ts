// apps/auth/src/auth.controller.ts
import { Body, Controller, Post, Res, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CurrentUser, SignUpDto, UserDocument } from 'lib/common';
import { Response } from 'express';

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
    @CurrentUser() user: UserDocument,

    @Res({ passthrough: true }) response: Response,
    @Req() request: Request,
  ) {
    console.log('Request user:', request);
    const jwt = await this.authService.signIn(user, response);
    response.send(jwt);
  }
}

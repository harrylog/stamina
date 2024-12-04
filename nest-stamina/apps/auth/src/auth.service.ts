import { Injectable, Inject, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { ClientProxy } from '@nestjs/microservices';
import {
  SignInDto,
  SignUpDto,
  TokenPayload,
  UserDto,
  USERS_SERVICE,
} from 'lib/common';
import * as bcrypt from 'bcryptjs';
import { lastValueFrom } from 'rxjs';
import { Response } from 'express';

@Injectable()
export class AuthService {
  constructor(
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
    @Inject(USERS_SERVICE) private readonly usersClient: ClientProxy,
  ) {}

  async signUp(signUpDto: SignUpDto, response: Response) {
    // Hash the password
    // const hashedPassword = await bcrypt.hash(String(signUpDto.password), 10);

    // Create user via users microservice
    const user = await lastValueFrom(
      this.usersClient.send('create_user', {
        ...signUpDto,
        roles: ['user'], // Default role
      }),
    );

    return this.generateToken(user, response);
  }
  async signIn(signInDto: SignInDto, response: Response) {
    // Find user via users microservice
    const user = await lastValueFrom(
      this.usersClient.send('get_user', { email: signInDto.email }),
    );

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(
      signInDto.password,
      user.password,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return this.generateToken(user, response);
  }
  private generateToken(user: UserDto, response: Response) {
    const tokenPayload: TokenPayload = {
      userId: user._id,
      email: user.email,
      roles: user.roles,
    };
    const expirationSeconds =
      this.configService.get<number>('JWT_EXPIRATION') || 3600;

    const token = this.jwtService.sign(tokenPayload, {
      expiresIn: expirationSeconds,
    });
    const expires = new Date();
    expires.setSeconds(
      expires.getSeconds() + this.configService.get('JWT_EXPIRATION'),
    );

    response.cookie('Authentication', token, {
      httpOnly: true,
    });
    return {
      access_token: token,
      user: {
        _id: user._id,
        email: user.email,
        roles: user.roles,
      },
      expiresIn: expirationSeconds, // Add this to response for clarity
    };
  }

  async validateUser(userId: string) {
    try {
      // Get user from users service
      const user = await lastValueFrom(
        this.usersClient.send('get_user', { _id: userId }),
      );

      if (!user) {
        throw new UnauthorizedException('User not found');
      }

      // Remove sensitive data
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...result } = user;
      return result;
    } catch (error) {
      throw new UnauthorizedException('Invalid user');
    }
  }
}

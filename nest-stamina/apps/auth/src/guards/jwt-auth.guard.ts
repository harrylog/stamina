// apps/auth/src/guards/jwt-auth.guard.ts
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractToken(request);

    if (!token) {
      throw new UnauthorizedException('No token provided');
    }

    try {
      const payload = await this.jwtService.verifyAsync(token);
      // Attach the user payload to the request object
      request.user = payload;
      return true;
    } catch (error) {
      console.error('Token verification failed:', error);
      throw new UnauthorizedException('Invalid token');
    }
  }

  private extractToken(request: Request): string | undefined {
    // If no bearer token, try to get from cookies
    const cookieToken = request.cookies?.Authentication;
    if (cookieToken) {
      return cookieToken;
    }
    // First try to get the token from the Authorization header
    const bearerToken = request.headers.authentication as string;
    if (bearerToken?.startsWith('Bearer ')) {
      return bearerToken.split(' ')[1];
    }

    return undefined;
  }
}
